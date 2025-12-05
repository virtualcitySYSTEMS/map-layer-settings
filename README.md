# @vcmap/layer-settings

> Part of the [VC Map Project](https://github.com/virtualcitySYSTEMS/map-ui)

The **Layer Settings** plugin allows you to edit parameters of layers at runtime. It adds, to the supported layers, an action in the Content Tree which opens a Settings window.

### Curently supported layer types and parameters

- **Pointcloud layers**:
  - `pointSize`
  - `screenSpaceError`
  - `attenuation`
- **Raster layers**:
  - `opacity`

### Configuration

Plugin's configuration allows to disable the settings for some types of layers. The default configuration is shown below.

```json
{
  "raster": true,
  "pointcloud": true
}
```
