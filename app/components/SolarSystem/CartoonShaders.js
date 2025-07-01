export const cartoonVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const cartoonFragmentShader = `
  uniform float time;
  uniform vec3 primaryColor;
  uniform vec3 secondaryColor;
  uniform vec3 accentColor;
  uniform vec3 emissiveColor;
  uniform vec3 glowColor;
  uniform bool isHovered;
  uniform float noiseScale;
  uniform float animSpeed;
  uniform float rimPower;
  uniform float emissiveStrength;
  uniform float patternIntensity;
  uniform int patternType;
  uniform vec3 sunPosition; // ✨ Position du soleil pour l'éclairage
  uniform float opacity; // ✨ Opacité pour animation d'apparition
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  
  // ✨ Fonction de bruit simple
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  // ✨ Patterns cartoon différents
  float getPattern(vec2 uv, int type) {
    if (type == 0) { // circuit
      float lines = step(0.9, sin(uv.x * 40.0)) + step(0.9, sin(uv.y * 40.0));
      float dots = step(0.95, sin(uv.x * 80.0) * sin(uv.y * 80.0));
      return (lines + dots) * 0.5;
    }
    else if (type == 1) { // tech - nuages qui font le tour de la planète
      vec2 cloud_uv = uv;
      // Coordonnées sphériques pour faire le tour
      float longitude = cloud_uv.x * 6.28318; // 2*PI pour faire le tour complet
      float latitude = (cloud_uv.y - 0.5) * 3.14159; // -PI/2 à PI/2 pour la hauteur
      
      // Animation qui fait tourner les nuages autour de la planète
      float rotating_time = time * 0.3;
      vec2 cloud_pos = vec2(longitude + rotating_time, latitude);
      
      // Nuages avec plusieurs couches
      float cloud1 = sin(cloud_pos.x * 2.0 + sin(cloud_pos.y * 3.0)) * 0.5 + 0.5;
      float cloud2 = sin(cloud_pos.x * 3.0 + cos(cloud_pos.y * 2.0 + time * 0.2)) * 0.3 + 0.3;
      float cloud3 = sin(cloud_pos.x * 1.5 + sin(cloud_pos.y * 4.0 + time * 0.15)) * 0.2 + 0.2;
      
      // Combinaison des couches de nuages
      float clouds = cloud1 * cloud2 + cloud3;
      return step(0.4, clouds);
    }
    else if (type == 2) { // money ($$$)
      float dollar = step(0.8, sin(uv.x * 15.0 + time)) * step(0.8, cos(uv.y * 15.0));
      return dollar;
    }
    else if (type == 3) { // hearts
      vec2 heart_uv = uv * 10.0;
      heart_uv = fract(heart_uv) - 0.5;
      float heart = length(heart_uv);
      return 1.0 - smoothstep(0.2, 0.3, heart);
    }
    else if (type == 4) { // hexagon
      vec2 hex_uv = uv * 8.0;
      float hexagon = abs(sin(hex_uv.x)) + abs(cos(hex_uv.y));
      return step(1.2, hexagon);
    }
    else if (type == 5) { // matrix
      float matrix = step(0.95, random(floor(uv * 50.0) + floor(time * 10.0)));
      return matrix;
    }
    
    return 0.0; // default
  }
  
  void main() {
    vec2 uv = vUv;
    vec3 normal = normalize(vNormal);
    
    // ✨ Pattern selon le type
    float pattern = getPattern(uv + time * animSpeed * 0.1, patternType);
    
    // ✨ Bruit de base
    float noise1 = noise(uv * noiseScale + time * animSpeed);
    float noise2 = noise(uv * noiseScale * 2.0 + time * animSpeed * 0.7);
    float combinedNoise = noise1 * 0.6 + noise2 * 0.4;
    
    // ✨ Pas de toon shading - rendu uniforme
    float toonShading = 1.0; // Éclairage uniforme
    
    // ✨ Rim lighting cartoon basé sur la direction vers la caméra
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float rimLight = 1.0 - abs(dot(normal, viewDirection));
    rimLight = pow(rimLight, rimPower);
    rimLight = step(0.3, rimLight); // Seuil pour effet cartoon
    
    // ✨ Couleurs de base avec patterns
    vec3 baseColor = mix(primaryColor, secondaryColor, combinedNoise);
    baseColor = mix(baseColor, accentColor, pattern * patternIntensity);
    
    // ✨ NOUVEAU: Contrôle de luminosité globale via emissiveStrength
    baseColor *= (0.3 + emissiveStrength * 2.0); // Luminosité de base contrôlée
    
    // ✨ Application du toon shading
    vec3 finalColor = baseColor * toonShading;
    
    // ✨ Rim glow cartoon - Augmenté l'impact
    finalColor += glowColor * rimLight * emissiveStrength * 2.0; // Multiplié par 2
    
    // ✨ Patterns émissifs - Augmenté l'impact
    finalColor += accentColor * pattern * patternIntensity * emissiveStrength;
    
    gl_FragColor = vec4(finalColor, opacity);
  }
`

export const texturedCartoonVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const texturedCartoonFragmentShader = `
  uniform float time;
  uniform sampler2D planetTexture;
  uniform vec3 primaryColor;
  uniform vec3 secondaryColor;
  uniform vec3 accentColor;
  uniform vec3 emissiveColor;
  uniform vec3 glowColor;
  uniform bool isHovered;
  uniform float noiseScale;
  uniform float animSpeed;
  uniform float rimPower;
  uniform float emissiveStrength;
  uniform float patternIntensity;
  uniform int patternType;
  uniform float textureBoost;
  uniform float cartoonPosterize;
  uniform vec3 sunPosition;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  
  // ✨ Fonction de bruit simple
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  // ✨ Posterisation pour effet cartoon
  vec3 posterize(vec3 color, float levels) {
    return floor(color * levels) / levels;
  }
  
  // ✨ Patterns cartoon différents
  float getPattern(vec2 uv, int type) {
    if (type == 0) { // circuit (gaming)
      float lines = step(0.9, sin(uv.x * 40.0)) + step(0.9, sin(uv.y * 40.0));
      float dots = step(0.95, sin(uv.x * 80.0) * sin(uv.y * 80.0));
      return (lines + dots) * 0.5;
    }
    else if (type == 1) { // tech - nuages qui font le tour de la planète
      vec2 cloud_uv = uv;
      // Coordonnées sphériques pour faire le tour
      float longitude = cloud_uv.x * 6.28318; // 2*PI pour faire le tour complet
      float latitude = (cloud_uv.y - 0.5) * 3.14159; // -PI/2 à PI/2 pour la hauteur
      
      // Animation qui fait tourner les nuages autour de la planète
      float rotating_time = time * 0.3;
      vec2 cloud_pos = vec2(longitude + rotating_time, latitude);
      
      // Nuages avec plusieurs couches
      float cloud1 = sin(cloud_pos.x * 2.0 + sin(cloud_pos.y * 3.0)) * 0.5 + 0.5;
      float cloud2 = sin(cloud_pos.x * 3.0 + cos(cloud_pos.y * 2.0 + time * 0.2)) * 0.3 + 0.3;
      float cloud3 = sin(cloud_pos.x * 1.5 + sin(cloud_pos.y * 4.0 + time * 0.15)) * 0.2 + 0.2;
      
      // Combinaison des couches de nuages
      float clouds = cloud1 * cloud2 + cloud3;
      return step(0.4, clouds);
    }
    else if (type == 2) { // money ($$$)
      float dollar = step(0.8, sin(uv.x * 15.0 + time)) * step(0.8, cos(uv.y * 15.0));
      return dollar;
    }
    else if (type == 3) { // hearts
      vec2 heart_uv = uv * 10.0;
      heart_uv = fract(heart_uv) - 0.5;
      float heart = length(heart_uv);
      return 1.0 - smoothstep(0.2, 0.3, heart);
    }
    else if (type == 4) { // hexagon
      vec2 hex_uv = uv * 8.0;
      float hexagon = abs(sin(hex_uv.x)) + abs(cos(hex_uv.y));
      return step(1.2, hexagon);
    }
    else if (type == 5) { // matrix
      float matrix = step(0.95, random(floor(uv * 50.0) + floor(time * 10.0)));
      return matrix;
    }
    
    return 0.0; // default
  }
  
  void main() {
    vec2 uv = vUv;
    vec3 normal = normalize(vNormal);
    
    // ✨ Texture de la planète
    vec4 texColor = texture2D(planetTexture, uv);
    vec3 baseTexture = texColor.rgb;
    
    // ✨ Boost de la texture pour plus d'intensité
    baseTexture = pow(baseTexture, vec3(0.8)); // Gamma correction
    baseTexture *= textureBoost;
    
    // ✨ Posterisation de la texture pour effet cartoon
    baseTexture = posterize(baseTexture, cartoonPosterize);
    
    // ✨ Pattern selon le type
    float pattern = getPattern(uv + time * animSpeed * 0.1, patternType);
    
    // ✨ Bruit de base
    float noise1 = noise(uv * noiseScale + time * animSpeed);
    float noise2 = noise(uv * noiseScale * 2.0 + time * animSpeed * 0.7);
    float combinedNoise = noise1 * 0.6 + noise2 * 0.4;
    
    // ✨ Pas de toon shading - rendu uniforme
    float toonShading = 1.0; // Éclairage uniforme
    
    // ✨ Rim lighting cartoon basé sur la direction vers la caméra
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float rimLight = 1.0 - abs(dot(normal, viewDirection));
    rimLight = pow(rimLight, rimPower);
    rimLight = step(0.7, rimLight); // Seuil pour effet cartoon
    
    // ✨ Mélange texture + couleurs thématiques
    vec3 colorOverlay = mix(primaryColor, secondaryColor, combinedNoise);
    
    // ✨ Combinaison texture et couleurs cartoon
    vec3 finalTexture = baseTexture;
    finalTexture = mix(finalTexture, finalTexture * colorOverlay, 0.3); // Overlay subtil
    finalTexture = mix(finalTexture, accentColor, pattern * patternIntensity * 0.4);
    
    // ✨ NOUVEAU: Contrôle de luminosité globale de la texture via emissiveStrength
    finalTexture *= (0.5 + emissiveStrength * 1.5); // Luminosité de texture contrôlée
    
    // ✨ Application du toon shading sur la texture
    vec3 finalColor = finalTexture * toonShading;
    
    // ✨ Rim glow cartoon - Augmenté l'impact
    finalColor += glowColor * rimLight * emissiveStrength * 3.0; // Multiplié par 3 pour les textures
    
    // ✨ Patterns émissifs par-dessus la texture - Augmenté l'impact  
    finalColor += accentColor * pattern * patternIntensity * emissiveStrength * 0.8;
    
    // ✨ Boost émissif général pour style cartoon - Augmenté
    finalColor += emissiveColor * emissiveStrength;
    
    // ✨ Saturation cartoon finale
    float saturation = 1.3;
    float gray = dot(finalColor, vec3(0.299, 0.587, 0.114));
    finalColor = mix(vec3(gray), finalColor, saturation);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

// ✨ Shader pour anneaux cartoon
export const ringVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const ringFragmentShader = `
  uniform float time;
  uniform vec3 ringColor;
  uniform vec3 accentColor;
  
  varying vec2 vUv;
  
  void main() {
    float dist = length(vUv - 0.5) * 2.0;
    
    // ✨ Anneaux cartoon avec animations
    float ring1 = smoothstep(0.4, 0.45, dist) * (1.0 - smoothstep(0.6, 0.65, dist));
    float ring2 = smoothstep(0.7, 0.75, dist) * (1.0 - smoothstep(0.9, 0.95, dist));
    
    // ✨ Animation des anneaux
    float pulse = sin(time * 3.0) * 0.3 + 0.7;
    float sparkle = step(0.98, sin(dist * 100.0 + time * 10.0));
    
    float alpha = (ring1 + ring2 * 0.7) * pulse + sparkle * 0.5;
    
    vec3 color = mix(ringColor, accentColor, sparkle);
    
    gl_FragColor = vec4(color, alpha * 0.8);
  }
`

export const sunVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const sunFragmentShader = `
  uniform float time;
  uniform sampler2D sunTexture;
  uniform vec3 primaryColor;
  uniform vec3 secondaryColor;
  uniform vec3 accentColor;
  uniform vec3 emissiveColor;
  uniform vec3 glowColor;
  uniform bool isHovered;
  uniform float noiseScale;
  uniform float animSpeed;
  uniform float rimPower;
  uniform float emissiveStrength;
  uniform float flameIntensity;
  uniform float coronaIntensity;
  uniform float textureRotation;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  
  // ✨ Fonction de bruit pour effets solaires
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  // ✨ Mapping UV sphérique vers cylindrique pour texture 2048x1024
  vec2 sphericalTocylindrical(vec3 normal) {
    float u = atan(normal.z, normal.x) / (2.0 * 3.14159265) + 0.5;
    float v = asin(normal.y) / 3.14159265 + 0.5;
    return vec2(u, v);
  }
  
  // ✨ Effet de flammes solaires
  float solarFlames(vec2 uv, float time) {
    vec2 flameUv = uv * vec2(4.0, 8.0) + vec2(time * 0.1, time * 0.3);
    float flame1 = noise(flameUv) * 0.5;
    float flame2 = noise(flameUv * 2.0 + time * 0.5) * 0.3;
    float flame3 = noise(flameUv * 4.0 + time * 0.8) * 0.2;
    return flame1 + flame2 + flame3;
  }
  
  float solarCorona(vec2 uv, float time) {
    vec2 coronaUv = uv * 3.0 + vec2(sin(time * 0.2), cos(time * 0.15));
    float corona = noise(coronaUv + time * 0.1);
    corona += noise(coronaUv * 2.0 + time * 0.2) * 0.5;
    return corona;
  }
  
  void main() {
    vec3 normal = normalize(vNormal);
    
    vec2 cylindricalUV = sphericalTocylindrical(normal);
    
    cylindricalUV.x += textureRotation;
    cylindricalUV.x = fract(cylindricalUV.x); // Wrap around
    
    vec4 sunTexColor = texture2D(sunTexture, cylindricalUV);
    vec3 baseTexture = sunTexColor.rgb;
    
    // ✨ Boost et correction de la texture réduite pour moins de luminosité
    baseTexture = pow(baseTexture, vec3(0.8)); // Gamma correction plus douce
    baseTexture *= 1.4; // Boost d'intensité réduit
    
    float flames = solarFlames(vUv, time) * flameIntensity * 0.4; // Réduit à 40%
    float corona = solarCorona(vUv, time) * coronaIntensity * 0.3; // Réduit à 30%
    
    float surfaceNoise = noise(vUv * noiseScale + time * animSpeed) * 0.3;
    
    vec3 hotColor = mix(primaryColor, secondaryColor, surfaceNoise);
    vec3 flameColor = mix(secondaryColor, accentColor, flames);
    
    vec3 solarSurface = baseTexture;
    solarSurface = mix(solarSurface, solarSurface * hotColor, 0.2); // Overlay très subtil
    solarSurface += flameColor * flames * 0.3; // Flammes moins intenses
    solarSurface += accentColor * corona * 0.15; // Couronne très subtile
    
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float rimLight = 1.0 - abs(dot(normal, viewDirection));
    rimLight = pow(rimLight, rimPower);
    
    vec3 finalColor = solarSurface;
    finalColor += glowColor * rimLight * coronaIntensity * 0.3; // Rim light encore plus subtil
    finalColor += emissiveColor * emissiveStrength * 0.2; // Émissif encore plus faible
    
    // ✨ Pulse solaire sur hover (encore plus subtil)
    float pulse = sin(time * 4.0) * 0.05 + 0.95; // Pulse très subtil
    finalColor *= pulse;
    finalColor += accentColor * 0.1; // Accent très faible
    
    // ✨ Saturation réduite pour éviter la sur-saturation
    float saturation = 1.1; // Saturation réduite
    float gray = dot(finalColor, vec3(0.299, 0.587, 0.114));
    finalColor = mix(vec3(gray), finalColor, saturation);
    
    // ✨ Boost final encore plus modéré
    finalColor = pow(finalColor, vec3(1.0)); // Pas de boost supplémentaire
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

export const coronaVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const coronaFragmentShader = `
  uniform float time;
  uniform vec3 primaryColor;
  uniform vec3 secondaryColor;
  uniform vec3 accentColor;
  uniform vec3 glowColor;
  uniform bool isHovered;
  uniform float noiseScale;
  uniform float animSpeed;
  uniform float intensity;
  uniform float pulseStrength;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  
  // ✨ Fonction de bruit pour la couronne
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  // ✨ Patterns de couronne dynamiques
  float coronaPattern(vec2 uv, float time) {
    vec2 rotatedUV = uv;
    float angle = time * 0.2;
    float c = cos(angle);
    float s = sin(angle);
    rotatedUV = mat2(c, -s, s, c) * (rotatedUV - 0.5) + 0.5;
    
    // Flammes radiantes
    float radial = atan(rotatedUV.y - 0.5, rotatedUV.x - 0.5);
    float radius = length(rotatedUV - 0.5);
    
    float flames = noise(vec2(radial * 4.0, radius * 6.0) + time * 0.3);
    flames += noise(vec2(radial * 8.0, radius * 12.0) + time * 0.5) * 0.5;
    flames += noise(vec2(radial * 16.0, radius * 20.0) + time * 0.8) * 0.25;
    
    // Éruptions solaires
    float eruptions = step(0.7, noise(rotatedUV * 3.0 + time * 0.4));
    eruptions *= sin(time * 5.0 + radial * 10.0) * 0.5 + 0.5;
    
    // Couches de plasma
    float plasma1 = noise(rotatedUV * 2.0 + vec2(time * 0.1, time * 0.15));
    float plasma2 = noise(rotatedUV * 4.0 + vec2(time * 0.2, time * 0.25)) * 0.7;
    float plasma3 = noise(rotatedUV * 8.0 + vec2(time * 0.3, time * 0.35)) * 0.4;
    
    float plasmaLayers = plasma1 + plasma2 + plasma3;
    
    return (flames * 0.4 + eruptions * 0.3 + plasmaLayers * 0.3) * intensity;
  }
  
  void main() {
    vec2 uv = vUv;
    vec3 normal = normalize(vNormal);
    
    // ✨ Distance au centre pour atténuation radiale
    float distFromCenter = length(uv - 0.5);
    
    // ✨ Pattern de couronne animé
    float coronaEffect = coronaPattern(uv, time);
    
    // ✨ Pulse respiratoire constant
    float basePulse = sin(time * 1.5) * 0.3 + 0.7;
    float microPulse = sin(time * 8.0) * 0.1 + 0.9;
    float totalPulse = basePulse * microPulse;
    
    // ✨ Pulse supplémentaire sur hover
    float hoverPulse = 1.0;
    if (isHovered) {
      hoverPulse = sin(time * 3.0) * 0.4 + 1.0;
      coronaEffect *= 1.5; // Plus d'intensité sur hover
    }
    
    // ✨ Atténuation en fonction de la distance
    float falloff = 1.0 - smoothstep(0.2, 0.8, distFromCenter);
    
    // ✨ Rim lighting pour l'effet de couronne
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float rimEffect = 1.0 - abs(dot(normal, viewDirection));
    rimEffect = pow(rimEffect, 1.5);
    
    // ✨ Couleurs dynamiques selon l'activité
    vec3 coreColor = mix(primaryColor, secondaryColor, coronaEffect);
    vec3 edgeColor = mix(secondaryColor, accentColor, rimEffect);
    vec3 finalColor = mix(coreColor, edgeColor, rimEffect * 0.6);
    
    // ✨ Intensité finale avec tous les effets
    float finalIntensity = coronaEffect * totalPulse * hoverPulse * falloff * rimEffect;
    finalIntensity = clamp(finalIntensity, 0.0, 1.0);
    
    // ✨ Émission supplémentaire pour l'effet wow
    finalColor += glowColor * finalIntensity * 0.3;
    
    gl_FragColor = vec4(finalColor, finalIntensity * intensity);
  }
`