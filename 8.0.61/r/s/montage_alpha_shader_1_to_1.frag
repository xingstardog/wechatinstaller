#extension GL_OES_EGL_image_external : require
precision highp float;
uniform samplerExternalOES texture;
varying highp vec2 v_TexCoordinate;
varying highp vec2 textureCoordinateRGB;
varying highp vec2 textureCoordinateAlpha;
uniform highp vec2 vSurfaceWidth;



void main() {
    highp vec4 rgbColor = texture2D(texture, textureCoordinateRGB);
    highp vec4 alphaColor = texture2D(texture, textureCoordinateAlpha);
    gl_FragColor = vec4(rgbColor.rgb * alphaColor.r, alphaColor.r);
}
