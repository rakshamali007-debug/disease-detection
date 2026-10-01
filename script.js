/* =========================================
   THREE.JS 3D SCENE
========================================= */

const container = document.getElementById("three-container");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);

camera.position.z = 5;


/* Renderer */

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(
    container.clientWidth,
    container.clientHeight
);

renderer.setPixelRatio(window.devicePixelRatio);

container.appendChild(renderer.domElement);


/* =========================================
   3D MEDICAL OBJECT
========================================= */

/* Main sphere */

const geometry = new THREE.IcosahedronGeometry(1.6, 2);

const material = new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    metalness: 0.5,
    roughness: 0.25,
    wireframe: true
});

const healthSphere = new THREE.Mesh(
    geometry,
    material
);

scene.add(healthSphere);


/* Inner sphere */

const innerGeometry =
    new THREE.SphereGeometry(1.15, 32, 32);

const innerMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x0a6f82,
        transparent: true,
        opacity: 0.25
    });

const innerSphere =
    new THREE.Mesh(
        innerGeometry,
        innerMaterial
    );

scene.add(innerSphere);


/* =========================================
   LIGHTING
========================================= */

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        1.5
    );

scene.add(ambientLight);


const pointLight =
    new THREE.PointLight(
        0x00e5ff,
        5,
        100
    );

pointLight.position.set(
    3,
    3,
    4
);

scene.add(pointLight);


/* =========================================
   SMALL PARTICLES
========================================= */

const particleGeometry =
    new THREE.BufferGeometry();

const particleCount = 300;

const positions = [];

for (let i = 0; i < particleCount; i++) {

    positions.push(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    );
}

particleGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
        positions,
        3
    )
);

const particleMaterial =
    new THREE.PointsMaterial({
        color: 0x00e5ff,
        size: 0.025
    });

const particles =
    new THREE.Points(
        particleGeometry,
        particleMaterial
    );

scene.add(particles);


/* =========================================
   ANIMATION
========================================= */

function animate() {

    requestAnimationFrame(animate);

    healthSphere.rotation.x += 0.003;

    healthSphere.rotation.y += 0.006;

    innerSphere.rotation.y -= 0.002;

    particles.rotation.y += 0.0005;

    renderer.render(
        scene,
        camera
    );
}

animate();


/* =========================================
   RESPONSIVE THREE.JS
========================================= */

window.addEventListener(
    "resize",
    () => {

        const width =
            container.clientWidth;

        const height =
            container.clientHeight;

        camera.aspect =
            width / height;

        camera.updateProjectionMatrix();

        renderer.setSize(
            width,
            height
        );
    }
);


/* =========================================
   START DETECTION
========================================= */

function startDetection() {

    document
        .getElementById("detection")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================================
   DISEASE DETECTION
========================================= */

function detectDisease() {

    const checkboxes =
        document.querySelectorAll(
            ".symptom input:checked"
        );

    const symptoms = [];

    checkboxes.forEach(
        checkbox => {
            symptoms.push(
                checkbox.value
            );
        }
    );


    const resultBox =
        document.getElementById(
            "result"
        );

    const resultTitle =
        document.getElementById(
            "result-title"
        );

    const resultText =
        document.getElementById(
            "result-text"
        );

    const resultDetails =
        document.getElementById(
            "result-details"
        );


    resultBox.style.display = "block";


    /* No symptoms */

    if (symptoms.length === 0) {

        resultTitle.textContent =
            "No Symptoms Selected";

        resultText.textContent =
            "Please select at least one symptom.";

        resultDetails.innerHTML = "";

        return;
    }


    /* =================================
       SIMPLE RULE-BASED SYSTEM
    ================================= */


    let disease = "";
    let description = "";


    /* Common cold */

    if (
        symptoms.includes("cough") &&
        symptoms.includes("sore_throat") &&
        symptoms.includes("headache")
    ) {

        disease = "Common Cold";

        description =
            "The selected symptoms can be associated with a common cold.";
    }


    /* Flu-like illness */

    else if (
        symptoms.includes("fever") &&
        symptoms.includes("cough") &&
        symptoms.includes("body_pain") &&
        symptoms.includes("fatigue")
    ) {

        disease = "Flu-like Illness";

        description =
            "The selected symptoms can occur with influenza or other respiratory infections.";
    }


    /* Stomach illness */

    else if (
        symptoms.includes("nausea") &&
        symptoms.includes("vomiting")
    ) {

        disease = "Stomach-related Illness";

        description =
            "Nausea and vomiting can occur with several stomach or gastrointestinal conditions.";
    }


    /* Fever */

    else if (
        symptoms.includes("fever") &&
        symptoms.includes("headache") &&
        symptoms.includes("fatigue")
    ) {

        disease = "Fever-related Illness";

        description =
            "Fever, headache and fatigue can occur with several infections and other conditions.";
    }


    /* Cough */

    else if (
        symptoms.includes("cough")
    ) {

        disease = "Respiratory Symptoms";

        description =
            "Cough may occur with several respiratory conditions.";
    }


    /* General */

    else {

        disease =
            "Multiple Possible Causes";

        description =
            "The selected symptoms can have many possible causes and cannot be used to determine a diagnosis.";
    }


    /* Display result */

    resultTitle.textContent =
        disease;

    resultText.textContent =
        description;


    resultDetails.innerHTML = `
        <strong>Selected symptoms:</strong>
        ${symptoms.join(", ")}
        <br><br>

        <strong>Important:</strong>
        This is an educational demonstration and
        not a medical diagnosis. If you are concerned
        about your symptoms, speak with a qualified
        healthcare professional.
    `;
}