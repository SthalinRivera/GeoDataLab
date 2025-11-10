<template>
    <div class="min-h-screen flex flex-col transition-colors duration-500 relative overflow-hidden ">

        <!-- Fondo futurista con grid y partículas -->
        <div class="absolute inset-0 -z-10 overflow-hidden">
            <!-- Grid futurista -->
            <div class="grid-background"></div>

            <!-- Gradiente base -->
            <div class="gradient-orb gradient-orb-1"></div>
            <div class="gradient-orb gradient-orb-2"></div>
            <div class="gradient-orb gradient-orb-3"></div>

            <!-- Partículas flotantes -->
            <div class="particle particle-1"></div>
            <div class="particle particle-2"></div>
            <div class="particle particle-3"></div>
            <div class="particle particle-4"></div>
            <div class="particle particle-5"></div>
            <div class="particle particle-6"></div>

            <!-- Líneas animadas -->
            <svg class="lines-overlay" xmlns="http://www.w3.org/2000/svg">
                <line class="animated-line line-1" x1="0" y1="30%" x2="100%" y2="30%" />
                <line class="animated-line line-2" x1="0" y1="60%" x2="100%" y2="60%" />
                <circle class="pulse-circle circle-1" cx="20%" cy="40%" r="3" />
                <circle class="pulse-circle circle-2" cx="80%" cy="70%" r="3" />
            </svg>

            <!-- Elementos geométricos -->
            <div class="geometric-shape shape-1"></div>
            <div class="geometric-shape shape-2"></div>
            <div class="geometric-shape shape-3"></div>
            <div class="geometric-shape shape-4"></div>

            <!-- Efecto de brillo scanning -->
            <div class="scan-line"></div>

            <!-- Símbolos de código flotantes -->
            <div class="code-symbol symbol-1">&lt;/&gt;</div>
            <div class="code-symbol symbol-2">{ }</div>
            <div class="code-symbol symbol-3">λ</div>
            <div class="code-symbol symbol-4">≡</div>
            <div class="code-symbol symbol-5">→</div>
            <div class="code-symbol symbol-6">∞</div>
            <div class="code-symbol symbol-7">⚡</div>
            <div class="code-symbol symbol-8">◇</div>

            <!-- Nubes abstractas -->
            <div class="abstract-cloud cloud-1"></div>
            <div class="abstract-cloud cloud-2"></div>
            <div class="abstract-cloud cloud-3"></div>
            <div class="abstract-cloud cloud-4"></div>

            <!-- Fragmentos de código binario -->
            <div class="binary-text binary-1">01001110</div>
            <div class="binary-text binary-2">11010110</div>
            <div class="binary-text binary-3">10101011</div>

            <!-- Iconos tecnológicos minimalistas -->
            <svg class="tech-icon icon-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="1.5" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="1.5" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="1.5" />
            </svg>
            <svg class="tech-icon icon-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" />
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4" />
            </svg>
            <svg class="tech-icon icon-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12H20M12 4L20 12L12 20" stroke="currentColor" stroke-width="1.5" />
            </svg>
        </div>

        <!-- Navbar sticky con glassmorphism -->
        <Navbar
            class="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 shadow-lg shadow-blue-500/5" />

        <!-- Main content -->
        <main class="flex-1 relative z-10">
            <div class="py-0 max-w-5xl mx-auto">
                <slot />
            </div>
        </main>

        <!-- Floating cart button -->
        <FloatingCartButton class="fixed bottom-6 right-6 z-40" />

        <!-- Footer -->
        <Footer />

    </div>
</template>

<script setup lang="ts">
// Opcional: imports si necesitas
</script>

<style scoped>
/* Grid futurista de fondo */
.grid-background {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: gridMove 20s linear infinite;
}

.dark .grid-background {
    background-image:
        linear-gradient(rgba(139, 92, 246, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139, 92, 246, 0.08) 1px, transparent 1px);
}

@keyframes gridMove {
    0% {
        transform: translate(0, 0);
    }

    100% {
        transform: translate(50px, 50px);
    }
}

/* Orbes de gradiente con blur */
.gradient-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.3;
    mix-blend-mode: screen;
}

.gradient-orb-1 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%);
    top: -10%;
    right: -10%;
    animation: float-orb 25s ease-in-out infinite;
}

.gradient-orb-2 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
    bottom: -5%;
    left: -5%;
    animation: float-orb-reverse 30s ease-in-out infinite;
}

.gradient-orb-3 {
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%);
    top: 40%;
    left: 50%;
    animation: float-orb 35s ease-in-out infinite;
}

.dark .gradient-orb {
    opacity: 0.2;
}

/* Partículas flotantes minimalistas */
.particle {
    position: absolute;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.6), rgba(139, 92, 246, 0.6));
    border-radius: 50%;
    animation: particleFloat 15s ease-in-out infinite;
}

.dark .particle {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(99, 102, 241, 0.8));
}

.particle-1 {
    width: 4px;
    height: 4px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
}

.particle-2 {
    width: 3px;
    height: 3px;
    top: 40%;
    right: 15%;
    animation-delay: 2s;
}

.particle-3 {
    width: 5px;
    height: 5px;
    bottom: 30%;
    left: 20%;
    animation-delay: 4s;
}

.particle-4 {
    width: 3px;
    height: 3px;
    top: 60%;
    right: 25%;
    animation-delay: 1s;
}

.particle-5 {
    width: 4px;
    height: 4px;
    bottom: 15%;
    right: 10%;
    animation-delay: 3s;
}

.particle-6 {
    width: 3px;
    height: 3px;
    top: 80%;
    left: 30%;
    animation-delay: 5s;
}

/* Líneas SVG animadas */
.lines-overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0.15;
}

.animated-line {
    stroke: rgba(99, 102, 241, 0.5);
    stroke-width: 1;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: drawLine 8s ease-in-out infinite;
}

.dark .animated-line {
    stroke: rgba(139, 92, 246, 0.6);
}

.line-2 {
    animation-delay: 4s;
}

.pulse-circle {
    fill: rgba(99, 102, 241, 0.6);
    animation: pulse 3s ease-in-out infinite;
}

.dark .pulse-circle {
    fill: rgba(139, 92, 246, 0.8);
}

.circle-2 {
    animation-delay: 1.5s;
}

/* Formas geométricas */
.geometric-shape {
    position: absolute;
    opacity: 0.1;
    animation: rotate-shape 20s linear infinite;
}

.dark .geometric-shape {
    opacity: 0.15;
}

.shape-1 {
    width: 60px;
    height: 60px;
    border: 2px solid rgba(99, 102, 241, 0.4);
    border-radius: 8px;
    top: 15%;
    right: 20%;
    animation-duration: 25s;
}

.shape-2 {
    width: 40px;
    height: 40px;
    border: 2px solid rgba(139, 92, 246, 0.4);
    border-radius: 50%;
    bottom: 25%;
    left: 15%;
    animation-duration: 30s;
    animation-direction: reverse;
}

.shape-3 {
    width: 50px;
    height: 50px;
    border: 2px solid rgba(59, 130, 246, 0.4);
    top: 50%;
    right: 10%;
    transform: rotate(45deg);
    animation-duration: 20s;
}

.shape-4 {
    width: 35px;
    height: 35px;
    border: 2px solid rgba(99, 102, 241, 0.4);
    border-radius: 50%;
    top: 70%;
    left: 25%;
    animation-duration: 28s;
    animation-direction: reverse;
}

/* Línea de escaneo */
.scan-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg,
            transparent 0%,
            rgba(99, 102, 241, 0.3) 50%,
            transparent 100%);
    animation: scan 8s ease-in-out infinite;
    opacity: 0.5;
}

.dark .scan-line {
    background: linear-gradient(90deg,
            transparent 0%,
            rgba(139, 92, 246, 0.5) 50%,
            transparent 100%);
}

/* Animaciones */
@keyframes float-orb {

    0%,
    100% {
        transform: translate(0, 0) scale(1);
    }

    33% {
        transform: translate(30px, -30px) scale(1.1);
    }

    66% {
        transform: translate(-20px, 20px) scale(0.9);
    }
}

@keyframes float-orb-reverse {

    0%,
    100% {
        transform: translate(0, 0) scale(1);
    }

    33% {
        transform: translate(-30px, 30px) scale(0.9);
    }

    66% {
        transform: translate(20px, -20px) scale(1.1);
    }
}

@keyframes particleFloat {

    0%,
    100% {
        transform: translate(0, 0);
        opacity: 0;
    }

    10% {
        opacity: 1;
    }

    90% {
        opacity: 1;
    }

    50% {
        transform: translate(50px, -100px);
    }
}

@keyframes drawLine {

    0%,
    100% {
        stroke-dashoffset: 1000;
        opacity: 0;
    }

    10%,
    90% {
        opacity: 1;
    }

    50% {
        stroke-dashoffset: 0;
    }
}

@keyframes pulse {

    0%,
    100% {
        r: 3;
        opacity: 1;
    }

    50% {
        r: 8;
        opacity: 0;
    }
}

@keyframes rotate-shape {
    0% {
        transform: rotate(0deg) translateY(0);
    }

    50% {
        transform: rotate(180deg) translateY(-20px);
    }

    100% {
        transform: rotate(360deg) translateY(0);
    }
}

@keyframes scan {
    0% {
        top: 0;
        opacity: 0;
    }

    50% {
        opacity: 1;
    }

    100% {
        top: 100%;
        opacity: 0;
    }
}

/* Símbolos de código flotantes */
.code-symbol {
    position: absolute;
    font-family: 'Courier New', monospace;
    font-size: 1.5rem;
    font-weight: bold;
    color: rgba(99, 102, 241, 0.15);
    animation: float-code 20s ease-in-out infinite;
    user-select: none;
    pointer-events: none;
}

.dark .code-symbol {
    color: rgba(139, 92, 246, 0.25);
}

.symbol-1 {
    top: 10%;
    left: 15%;
    font-size: 2rem;
    animation-delay: 0s;
    animation-duration: 25s;
}

.symbol-2 {
    top: 25%;
    right: 20%;
    font-size: 1.8rem;
    animation-delay: 3s;
    animation-duration: 22s;
}

.symbol-3 {
    top: 45%;
    left: 8%;
    font-size: 2.2rem;
    animation-delay: 6s;
    animation-duration: 28s;
}

.symbol-4 {
    bottom: 30%;
    right: 15%;
    font-size: 1.6rem;
    animation-delay: 2s;
    animation-duration: 24s;
}

.symbol-5 {
    top: 65%;
    left: 25%;
    font-size: 2rem;
    animation-delay: 4s;
    animation-duration: 26s;
}

.symbol-6 {
    bottom: 15%;
    left: 12%;
    font-size: 1.9rem;
    animation-delay: 7s;
    animation-duration: 23s;
}

.symbol-7 {
    top: 35%;
    right: 10%;
    font-size: 1.7rem;
    animation-delay: 1s;
    animation-duration: 27s;
}

.symbol-8 {
    bottom: 40%;
    right: 30%;
    font-size: 2.1rem;
    animation-delay: 5s;
    animation-duration: 25s;
}

/* Nubes abstractas */
.abstract-cloud {
    position: absolute;
    background: linear-gradient(135deg,
            rgba(99, 102, 241, 0.05),
            rgba(139, 92, 246, 0.05));
    border-radius: 100px;
    filter: blur(40px);
    animation: drift-cloud 40s ease-in-out infinite;
}

.dark .abstract-cloud {
    background: linear-gradient(135deg,
            rgba(139, 92, 246, 0.08),
            rgba(99, 102, 241, 0.08));
}

.cloud-1 {
    width: 300px;
    height: 120px;
    top: 15%;
    left: -50px;
    animation-duration: 45s;
}

.cloud-2 {
    width: 250px;
    height: 100px;
    top: 50%;
    right: -50px;
    animation-duration: 50s;
    animation-delay: 5s;
}

.cloud-3 {
    width: 200px;
    height: 80px;
    bottom: 25%;
    left: -40px;
    animation-duration: 55s;
    animation-delay: 10s;
}

.cloud-4 {
    width: 280px;
    height: 110px;
    top: 75%;
    right: -60px;
    animation-duration: 48s;
    animation-delay: 15s;
}

/* Texto binario */
.binary-text {
    position: absolute;
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    color: rgba(99, 102, 241, 0.12);
    letter-spacing: 2px;
    animation: float-binary 15s ease-in-out infinite;
    user-select: none;
    pointer-events: none;
}

.dark .binary-text {
    color: rgba(139, 92, 246, 0.2);
}

.binary-1 {
    top: 20%;
    right: 25%;
    animation-delay: 0s;
}

.binary-2 {
    bottom: 35%;
    left: 18%;
    animation-delay: 3s;
    animation-duration: 18s;
}

.binary-3 {
    top: 55%;
    right: 12%;
    animation-delay: 6s;
    animation-duration: 20s;
}

/* Iconos tecnológicos */
.tech-icon {
    position: absolute;
    width: 40px;
    height: 40px;
    color: rgba(99, 102, 241, 0.15);
    animation: float-icon 18s ease-in-out infinite;
    pointer-events: none;
}

.dark .tech-icon {
    color: rgba(139, 92, 246, 0.25);
}

.icon-1 {
    top: 30%;
    left: 35%;
    animation-delay: 0s;
    animation-duration: 22s;
}

.icon-2 {
    bottom: 28%;
    right: 35%;
    animation-delay: 4s;
    animation-duration: 25s;
}

.icon-3 {
    top: 60%;
    left: 45%;
    animation-delay: 8s;
    animation-duration: 20s;
}

/* Animaciones para elementos flotantes */
@keyframes float-code {

    0%,
    100% {
        transform: translate(0, 0) rotate(0deg);
        opacity: 0;
    }

    10% {
        opacity: 1;
    }

    50% {
        transform: translate(30px, -50px) rotate(10deg);
    }

    90% {
        opacity: 1;
    }
}

@keyframes drift-cloud {
    0% {
        transform: translateX(0);
    }

    50% {
        transform: translateX(calc(100vw + 100px));
    }

    50.01% {
        transform: translateX(calc(-300px));
    }

    100% {
        transform: translateX(0);
    }
}

@keyframes float-binary {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
    }

    10%,
    90% {
        opacity: 1;
    }

    50% {
        transform: translateY(-80px) rotate(-5deg);
    }
}

@keyframes float-icon {

    0%,
    100% {
        transform: translate(0, 0) rotate(0deg) scale(1);
        opacity: 0;
    }

    10%,
    90% {
        opacity: 1;
    }

    25% {
        transform: translate(20px, -30px) rotate(90deg) scale(1.1);
    }

    50% {
        transform: translate(-10px, -60px) rotate(180deg) scale(0.9);
    }

    75% {
        transform: translate(15px, -40px) rotate(270deg) scale(1.05);
    }
}

/* Optimización de rendimiento */
.gradient-orb,
.particle,
.geometric-shape,
.code-symbol,
.abstract-cloud,
.binary-text,
.tech-icon {
    will-change: transform;
}
</style>