
export class Params {

    constructor(resetSimulation) {

        //Function used to update the animation
        this.resetSimulation = resetSimulation;

        //Camera parameters
        this.cameraDistance = 3;
        this.FOV = 30;
        this.lockCamera = false;

        //Position based fluids parameters
        this.updateSimulation = true;
        this.deltaTime = 0.06;
        this.constrainsIterations = 8;
        this.pbfResolution = 16;
        this.voxelTextureSize = 512;
        this.particlesTextureSize = 256;

        //Marching cubes parameters, Change these values to change marching cubes resolution (128/2048/1024 or 256/4096/2048)
        this.factor = 8;
        this.resolution = 8 * this.factor;
        this.expandedTextureSize = 64 * this.factor;
        this.expandedBuckets = this.factor;
        this.compressedTextureSize = 32 * this.factor;
        this.compressedBuckets = this.factor/2;
        this.depthLevels = this.factor * 2;
        this.compactTextureSize = 128 * this.factor;
        this.particleSize = 3;
        this.blurSteps = 10;
        this.range = 0.24;
        this.maxCells = 3.2;
        this.fastNormals = false;
        this.updateMesh = true;

        //General raytracer parameters
        this.lowResolutionTextureSize = 256;
        this.lowGridPartitions = 32;
        this.lowSideBuckets = 8;
        this.sceneSize = 512;       //Requires to be a power of two for mip mapping
        this.floorTextureSize = 256;
        this.floorScale = 4;
        this.killRay = 0.1;
        this.updateImage = true;

        //Material parameters (dielectric)
        this.refraction = 1.1;
        this.maxIterations = 256;
        this.refractions = 4;
        this.reflections = 3;
        this.maxStepsPerBounce = 256;
        this.absorptionColor = [250, 150,152];
        this.dispersion = 0.1;
        this.energyDecay = 0;
        this.distanceAbsorptionScale = 6;
        this.materialColor = [255, 255, 255];
        this.kS = 0.96;
        this.kD = 0.2;
        this.kA = 0.08;
        this.shinny = 30;

        //Light parameters
        this.lightAlpha = 48;
        this.lightBeta = 0;
        this.lightIntensity = 2.5;
        this.lightDistance = 3;
        this.backgroundColor = 0.6;
        this.lightColor = [255, 255, 255];
        this.calculateShadows = true;
        this.shadowIntensity = 0.3;
        this.blurShadowsRadius = 30;

        //Caustics parameters
        this.photonSize = 5;
        this.photonEnergy = 0.16;
        this.reflectionPhotons = 0.8;
        this.photonsToEmit = 1;
        this.photonSteps = 1;
        this.radianceRadius = 2;
        this.radiancePower = 0.32;
        this.calculateCaustics = true;
        this.causticsSize = 256;
        this.totalPhotons = this.causticsSize * this.causticsSize;
        this.causticSteps = 0;

    }

    //Generate the particles, this is done here to have different particles setup in
    //different params files
    generateParticles() {
        this.totalParticles = 0;
        let particlesPosition = [];
        let particlesVelocity = [];
        let radius = this.pbfResolution * 0.45;
        //Generate the position and velocity
        for (let i = 0; i < this.pbfResolution; i++) {
            for (let j = 0; j < this.pbfResolution; j++) {
                for (let k = 0; k < this.pbfResolution; k++) {

                    //Condition for the particle position and existence
                    let x = i - this.pbfResolution * 0.5;
                    let y = j - this.pbfResolution * 0.5;
                    let z = k - this.pbfResolution * 0.5;

                    if (x * x + y * y + z * z < radius * radius && k < this.pbfResolution * 0.4) {
                        particlesPosition.push(i, j, k, 1);
                        particlesVelocity.push(0, 0, 0, 0);
                        this.totalParticles++;
                    }
                }
            }
        }

        return {particlesPosition: particlesPosition, particlesVelocity: particlesVelocity}
    }

}




