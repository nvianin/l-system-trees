const log = console.log


//rho = distance, theta = azimuth, phi = elevation
const sphericalToCartesian = (distance, azimuth, elevation) => {
    return new THREE.Vector3(
        distance * Math.sin(elevation) * Math.cos(azimuth),
        distance * Math.sin(elevation) * Math.sin(azimuth),
        distance * Math.cos(elevation)
    )
}