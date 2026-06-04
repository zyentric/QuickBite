const fs = require('fs');
const path = require('path');

const targetPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-push-notification',
  'android',
  'build.gradle'
);

if (fs.existsSync(targetPath)) {
  console.log('Fixing jcenter() in react-native-push-notification...');
  let content = fs.readFileSync(targetPath, 'utf8');
  content = content.replace(/jcenter\(\)/g, 'mavenCentral()');
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log('Fixed successfully!');
} else {
  console.log('react-native-push-notification build.gradle not found, skipping fix.');
}
