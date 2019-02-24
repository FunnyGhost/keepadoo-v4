module.exports = {
  name: 'keepadoo',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/keepadoo/',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
