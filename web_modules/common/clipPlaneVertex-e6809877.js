import { f as Effect } from './thinEngine-e576a091.js';

var name = 'clipPlaneFragmentDeclaration';
var shader = "#ifdef CLIPPLANE\nvarying float fClipDistance;\n#endif\n#ifdef CLIPPLANE2\nvarying float fClipDistance2;\n#endif\n#ifdef CLIPPLANE3\nvarying float fClipDistance3;\n#endif\n#ifdef CLIPPLANE4\nvarying float fClipDistance4;\n#endif\n#ifdef CLIPPLANE5\nvarying float fClipDistance5;\n#endif\n#ifdef CLIPPLANE6\nvarying float fClipDistance6;\n#endif";
Effect.IncludesShadersStore[name] = shader;

var name$1 = 'clipPlaneFragment';
var shader$1 = "#ifdef CLIPPLANE\nif (fClipDistance>0.0)\n{\ndiscard;\n}\n#endif\n#ifdef CLIPPLANE2\nif (fClipDistance2>0.0)\n{\ndiscard;\n}\n#endif\n#ifdef CLIPPLANE3\nif (fClipDistance3>0.0)\n{\ndiscard;\n}\n#endif\n#ifdef CLIPPLANE4\nif (fClipDistance4>0.0)\n{\ndiscard;\n}\n#endif\n#ifdef CLIPPLANE5\nif (fClipDistance5>0.0)\n{\ndiscard;\n}\n#endif\n#ifdef CLIPPLANE6\nif (fClipDistance6>0.0)\n{\ndiscard;\n}\n#endif";
Effect.IncludesShadersStore[name$1] = shader$1;

var name$2 = 'clipPlaneVertexDeclaration';
var shader$2 = "#ifdef CLIPPLANE\nuniform vec4 vClipPlane;\nvarying float fClipDistance;\n#endif\n#ifdef CLIPPLANE2\nuniform vec4 vClipPlane2;\nvarying float fClipDistance2;\n#endif\n#ifdef CLIPPLANE3\nuniform vec4 vClipPlane3;\nvarying float fClipDistance3;\n#endif\n#ifdef CLIPPLANE4\nuniform vec4 vClipPlane4;\nvarying float fClipDistance4;\n#endif\n#ifdef CLIPPLANE5\nuniform vec4 vClipPlane5;\nvarying float fClipDistance5;\n#endif\n#ifdef CLIPPLANE6\nuniform vec4 vClipPlane6;\nvarying float fClipDistance6;\n#endif";
Effect.IncludesShadersStore[name$2] = shader$2;

var name$3 = 'clipPlaneVertex';
var shader$3 = "#ifdef CLIPPLANE\nfClipDistance=dot(worldPos,vClipPlane);\n#endif\n#ifdef CLIPPLANE2\nfClipDistance2=dot(worldPos,vClipPlane2);\n#endif\n#ifdef CLIPPLANE3\nfClipDistance3=dot(worldPos,vClipPlane3);\n#endif\n#ifdef CLIPPLANE4\nfClipDistance4=dot(worldPos,vClipPlane4);\n#endif\n#ifdef CLIPPLANE5\nfClipDistance5=dot(worldPos,vClipPlane5);\n#endif\n#ifdef CLIPPLANE6\nfClipDistance6=dot(worldPos,vClipPlane6);\n#endif";
Effect.IncludesShadersStore[name$3] = shader$3;
