// // src/utils/toast.js

// let toastContainer = null;

// export function showToast(message, duration = 3000) {
//     if (!toastContainer) {
//         toastContainer = document.createElement("div");
//         toastContainer.style.position = "fixed";
//         toastContainer.style.bottom = "20px";
//         toastContainer.style.right = "20px";
//         toastContainer.style.zIndex = "9999";
//         toastContainer.style.display = "flex";
//         toastContainer.style.flexDirection = "column";
//         toastContainer.style.gap = "12px";
//         document.body.appendChild(toastContainer);
//     }

//     const toast = document.createElement("div");
//     toast.textContent = message;

//     // Apply styles
//     toast.style.background = "#086972"; // Tailwind primary color
//     toast.style.color = "white";
//     toast.style.padding = "14px 20px"; // Increased padding
//     toast.style.borderRadius = "10px";
//     toast.style.fontSize = "14.7px"; // 5% larger than 14px
//     toast.style.fontFamily = "Lato, sans-serif";
//     toast.style.boxShadow = "0 4px 14px rgba(0,0,0,0.22)";
//     toast.style.animation = "fadeInUp .32s ease";

//     toastContainer.appendChild(toast);

//     // Auto remove
//     setTimeout(() => {
//         toast.style.transition = "opacity .3s, transform .3s";
//         toast.style.opacity = "0";
//         toast.style.transform = "translateY(6px)";

//         setTimeout(() => toast.remove(), 300);
//     }, duration);
// }


// // Add animation to document
// const style = document.createElement("style");
// style.textContent = `
// @keyframes fadeInUp {
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// `;
// document.head.appendChild(style);

// src/utils/toast.js

let toastContainer = null;

export function showToast(message, duration = 4000) { // default 4s
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.style.position = "fixed";
        toastContainer.style.bottom = "20px";
        toastContainer.style.right = "20px";
        toastContainer.style.zIndex = "9999";
        toastContainer.style.display = "flex";
        toastContainer.style.flexDirection = "column";
        toastContainer.style.gap = "12px";
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement("div");
    toast.textContent = message;

    // Apply styles
    toast.style.background = "#086972"; // Tailwind primary color
    toast.style.color = "white";
    toast.style.padding = "12px 20px"; 
    toast.style.borderRadius = "12px"; 
    toast.style.fontSize = "15px"; 
    toast.style.fontWeight = "600"; // bolder
    toast.style.fontFamily = "Lato, sans-serif";
    toast.style.boxShadow = "0 6px 18px rgba(0,0,0,0.25)";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "opacity 0.35s ease, transform 0.35s ease";

    toastContainer.appendChild(toast);

    // Trigger fade-in
    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    });

    // Auto remove
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(6px)";

        setTimeout(() => toast.remove(), 350);
    }, duration);
}

// Optional: global fadeInUp animation keyframe
const style = document.createElement("style");
style.textContent = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(style);
