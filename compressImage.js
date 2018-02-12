const imagemin = require('imagemin');
const imageminJpegoptim = require('imagemin-jpegoptim');
const imageminPngquant = require('imagemin-pngquant');

var imagePath = 'E:/ElevateNV/wetransfer-ad6a31/wp-content/uploads/2017/04/greenhouse-2-960x641.jpeg'
var slicePosition =  imagePath.lastIndexOf('/')
var buildPath = imagePath.slice(0,slicePosition)
imagemin([imagePath], buildPath, {
	plugins: [
    imageminJpegoptim({progressive: true, max: 80, stripAll:false}),
		imageminPngquant({quality: '70'})
	]
}).then(files => {
	console.log(files);
	//=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
});