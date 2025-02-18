#version 330 compatibility
uniform float uSc; // s center of the magnifying lens
uniform float uTc; // t center of the magic lens
uniform float uMag; // magnification factor
uniform float uRad; // radius of the lens


uniform sampler2D uImageUnit; // 

in vec2 vST; //* interpolated texture coordinates */




void main(){
    vec2 st = vST - vec2(uSc, uTc); // shifting the lens to (0, 0)
    float r = length(st); // compute the radius of the lens

    vec4 fragColor;
    if(r > uRad){
        vec3 rgb = texture(uImageUnit, vST).rgb;
        fragColor = vec4(rgb, 1.);

    }else{
        //* inside the magnifying lens: apply the maginification */

        float r_prime = r * uMag; //  scale radius for the magnifications process
        vec2 st_prime = (r > 0.0 ) ? (r_prime / r) * st + vec2(uSc, uTc) : uvec2(uSc, uTc); // Restore original offset

        vec3 rgb = texture(uImageUnit, st_prime).rgb;
        fragColor = vec4(rgb, 1.);
    }

    gl_FragColor = fragColor;
}