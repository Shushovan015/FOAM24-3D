import * as THREE from "three";

export class FoamMaterial extends THREE.ShaderMaterial {
  constructor(color, topLayerColor, topLayerThickness, foamHeight) {
    color = new THREE.Color(color);
    topLayerColor = new THREE.Color(topLayerColor);
    super({
      vertexShader: `
              varying vec3 vWorldPosition;
              varying vec3 vViewPosition;
              varying vec3 vViewNormal;
  
              void main() {
                 vWorldPosition = vec3(modelMatrix * vec4(position, 1.0));
                 vViewPosition = vec3(modelViewMatrix * vec4(position, 1.0));
                 vViewNormal = normalMatrix * normal;
                 gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
           `,
      fragmentShader: `
              varying vec3 vWorldPosition;
              varying vec3 vViewPosition;
              varying vec3 vViewNormal;
              uniform vec3 color;
              uniform vec3 topLayerColor;
              uniform float topLayerThickness;
              uniform float foamHeight;
  
              void main() {
                 float lambertFactor = dot(-normalize(vViewPosition), normalize(vViewNormal));
                 float heightFactor = vWorldPosition.z / foamHeight;
                 float factor = lambertFactor * heightFactor;
                 float minLight = 0.1;
                 factor = factor*(1.0-minLight) + (minLight);
                 
                 if (vWorldPosition.z < foamHeight - topLayerThickness) {
                    gl_FragColor.rgb = color.rgb;
                 } else {
                    gl_FragColor.rgb = topLayerColor.rgb;
                 }
  
                 gl_FragColor.rgb *= factor;
                 gl_FragColor.a = 1.0;
              }
           `,
      uniforms: {
        color: { value: new THREE.Vector3(color.r, color.g, color.b) },
        topLayerColor: {
          value: new THREE.Vector3(
            topLayerColor.r,
            topLayerColor.g,
            topLayerColor.b
          ),
        },
        topLayerThickness: { value: topLayerThickness },
        foamHeight: { value: foamHeight },
      },
    });
  }
}

export class LambertMaterial extends THREE.ShaderMaterial {
  constructor(color) {
    color = new THREE.Color(color);
    super({
      vertexShader: `
            varying vec3 vViewPosition;
            varying vec3 vViewNormal;

            void main() {
               vViewPosition = vec3(modelViewMatrix * vec4(position, 1.0));
               vViewNormal = normalMatrix * normal;
               gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
         `,
      fragmentShader: `
            varying vec3 vViewPosition;
            varying vec3 vViewNormal;
            uniform vec3 color;

            void main() {
               float factor = dot(-normalize(vViewPosition), normalize(vViewNormal));
               float minLight = 0.1;
               factor = factor*(1.0-minLight) + (minLight);
               
               gl_FragColor.rgb = color.rgb;
               gl_FragColor.rgb *= factor;
               gl_FragColor.a = 1.0;
            }
         `,
      uniforms: {
        color: { value: new THREE.Vector3(color.r, color.g, color.b) },
      },
    });
  }
}
