export default {
  appConfig: {
    modules: [
      'config/base.config.json',
      'config/dev.config.json',
      'config/projects.config.json',
      {
        _id: 'layer-settings-dev-module',
        name: 'Layer Settings Plugin',
        startingViewpointName: 'start',
        contentTree: [
          {
            name: 'Pointcloud test',
            layerName: '0813a23e-126e-4ed6-89ae-9f2ca8deaa2e',
            type: 'LayerContentTreeItem',
            weight: 1,
          },
        ],
        viewpoints: [
          {
            name: 'start',
            type: 'Viewpoint',
            distance: 942.0888812378691,
            cameraPosition: [
              7.092778991959692, 51.5044686806491, 672.0867835491848,
            ],
            groundPosition: [
              7.088279890429838, 51.51018596857195, 51.37414967585915,
            ],
            heading: 333.84726541319327,
            pitch: -41.216796070905154,
            roll: 359.99869746763073,
            animate: false,
          },
        ],
        layers: [
          {
            name: '0813a23e-126e-4ed6-89ae-9f2ca8deaa2e',
            properties: { title: 'PointcloudSettingsDemo' },
            activeOnStartup: true,
            type: 'PointCloudLayer',
            url: 'http://publisher/datasource-data/90eb86a7-4176-441d-9615-4cd5c754a59f/tileset.json',
          },
        ],
      },
    ],
  },
};
