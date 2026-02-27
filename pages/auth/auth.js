import { API_BASE_URL } from "../../scripts/main.js";
import { updateAuthButtons } from "../../scripts/navigation.js";

export function init() {
    // Detectar qué página de auth es basándose en el contenido del DOM
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    
    if (loginForm) {
        initLogin();
    } else if (registerForm) {
        initRegister();
    }
}

function initLogin() {
    const form = document.getElementById("loginForm");
    const goToRegisterLink = document.getElementById("goToRegisterLink");
    
    if (form) {
        form.addEventListener("submit", handleLogin);
    }
    
    if (goToRegisterLink) {
        goToRegisterLink.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.hash = "#register";
            window.location.reload();
        });
    }
}

function initRegister() {
    const form = document.getElementById("registerForm");
    const goToLoginLink = document.getElementById("goToLoginLink");
    
    if (form) {
        form.addEventListener("submit", handleRegister);
    }
    
    if (goToLoginLink) {
        goToLoginLink.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.hash = "#login";
            window.location.reload();
        });
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("emailTxt")?.value.trim();
    const password = document.getElementById("passwordTxt")?.value;

    if (!email || !password) {
        alert("Completa todos los campos");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al iniciar sesión");
        }

        const data = await response.json();
        
        // Guardar token y usuario
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        
        // Actualizar UI
        updateUserUI(data.usuario);
        updateAuthButtons();
        
        // Redirigir a inicio
        alert("¡Bienvenido " + data.usuario.nombre + "!");
        window.location.hash = "#inicio";
        window.location.reload();
    } catch (err) {
        console.error("Error al hacer login:", err);
        alert(err.message || "No se pudo iniciar sesión. Verifica tus credenciales.");
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const nombre = document.getElementById("nombreTxt")?.value.trim();
    const email = document.getElementById("emailTxt")?.value.trim();
    const telefono = document.getElementById("telefonoTxt")?.value.trim() || null;
    const password = document.getElementById("passwordTxt")?.value;
    const confirmPassword = document.getElementById("confirmPasswordTxt")?.value;
    const rol = "Cliente"; // Siempre crear como Cliente por defecto

    if (!nombre || !email || !password) {
        alert("Completa todos los campos obligatorios");
        return;
    }

    if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres");
        return;
    }

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, email, telefono, password, rol })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al registrar usuario");
        }

        const data = await response.json();
        
        // Guardar token y usuario
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        
        // Actualizar UI
        updateUserUI(data.usuario);
        updateAuthButtons();
        
        // Redirigir a inicio
        alert("¡Cuenta creada exitosamente! Bienvenido " + data.usuario.nombre);
        window.location.hash = "#inicio";
        window.location.reload();
    } catch (err) {
        console.error("Error al registrar:", err);
        alert(err.message || "No se pudo crear la cuenta. Verifica los datos.");
    }
}

export function updateUserUI(usuario) {
    const userPhoto = document.querySelector('[name="user-photo"]');
    const userName = document.querySelector('.profile h4');
    
    if (userName) {
        userName.textContent = usuario.nombre || "Usuario";
    }
    
    // Opcional: cargar foto de perfil si existe
    if (userPhoto && usuario.foto) {
        userPhoto.src = usuario.foto;
    }
}

export function getToken() {
    return localStorage.getItem("token");
}

export function getUsuario() {
    const usuarioStr = localStorage.getItem("usuario");
    return usuarioStr ? JSON.parse(usuarioStr) : null;
}

export function isAuthenticated() {
    return !!getToken();
}

export async function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    updateUserUI({ nombre: "Usuario" });
    
    try {
        const { updateAuthButtons } = await import('../../scripts/navigation.js');
        updateAuthButtons();
    } catch (error) {
        console.error("Error al actualizar botones:", error);
    }
    
    window.location.hash = "#inicio";
    window.location.reload();
}
