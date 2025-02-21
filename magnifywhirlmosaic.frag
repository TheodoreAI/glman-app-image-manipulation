#version 330 compatibility
uniform float uSc; // s center of the magnifying lens
uniform float uTc; // t center of the magic lens
uniform float uMag; // magnification factor
uniform float uWhirl; // whirling factor
uniform float uMosaic; // mosaic factor
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

        float r_prime = r * uMag; //  scale radius for the magnification process
        vec2 st_prime = (r > 0.0 ) ? (r_prime / r) * st + vec2(uSc, uTc) : vec2(uSc, uTc); // Restore original offset

       

        //* whirling effect */
        float theta = atan(st.t, st.s);
        float theta_prime = theta - uWhirl * r_prime;

        st_prime = r_prime * vec2(cos(theta_prime), sin(theta_prime));
        st_prime += vec2(uSc, uTc);

        //* The Mosaic effect! */
        int numins = int(st_prime.s / uMosaic);
        int numint = int(st_prime.t / uMosaic);

        float sc = float(numins) * uMosaic + uMosaic / 2; // Center of the block
        float tc = float(numint) * uMosaic + uMosaic / 2;

        st_prime.s = sc; //* assign the centers*/
        st_prime.t = tc;

        //* make sure its a vec4 into the fragColor */
        vec3 rgb = texture(uImageUnit, st_prime).rgb;
        fragColor = vec4(rgb, 1.);
    }

    gl_FragColor = fragColor;
}