
var admin = require("firebase-admin");
var fs = require('fs');
var xml2js = require('xml2js');
const UUID = require("uuid-v4");
const postList = require('./old_all.json')
const categories = require('./categories.json')
const attachment = require('./attachment.json')
const formated_posts = require('./posts.json')

var serviceAccount = require("./elevatenv-dev-firebase-adminsdk-mwnnt-619c643194.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();
var bucket = admin.storage().bucket("elevatenv-dev.appspot.com");
var parser = new xml2js.Parser();
// ########################## Conver xmls to json ######################################
// fs.readFile(__dirname + '/elevate_all.xml', function(err, data) {
//     parser.parseString(data, function (err, result) {
//         console.log('Read');
//         fs.writeFile("./old_all.json", JSON.stringify(result), function(err) {
//           if(err) {
//               return console.log(err);
//           }
//           console.log("The file was saved!");
//         });
//     });
// });
// ####################################################################################
// ########################## Add authors #############################################
// var batch = db.batch();
// fs.readFile(__dirname + '/elevate_old_post.xml', function(err, data) {
//   parser.parseString(data, function (err, result) {
//       console.log('Read');
//       //console.log(result.rss.channel[0]['wp:author'])
//       var authors = result.rss.channel[0]['wp:author']
//       authors.forEach(author => {
//         if (author["wp:author_login"][0] == 'DeannaRilling' ||author["wp:author_login"][0] == 'BethSchwartz'||author["wp:author_login"][0] == 'elevatenv'||author["wp:author_login"][0] == "elevateadmin"){
//           return
//         }
//         var ref = db.collection('authors').doc(author["wp:author_login"][0])
//         batch.set(ref, {
//           bio: '',
//           imageName: '',
//           imageUrl: '',
//           name: author['wp:author_display_name'][0],
//           posts: []
//         })
//       });
//       return batch.commit().then(function () {
//         console.log('authors added')
//       })
//       .catch(function(err) {
//         console.log('Error add authors', err);
//       });
//   });
// });
// ###################################################################################

// var batch = db.batch();
// var author_list = {
//   'DeannaRilling': 'Indwe3LYuUTISBvsLqvu',
//   'BethSchwartz': 'YVgHldSv3JLwuJiz24MP',
//   'elevatenv': 'aNLrxxrTs08mtC7I886G',
//   'elevateadmin': 'aNLrxxrTs08mtC7I886G'
// }
// fs.readFile(__dirname + '/elevate_old_post.xml', function(err, data) {
//   parser.parseString(data, function (err, result) {
//       console.log('Read');
//       //console.log(result.rss.channel[0]['wp:author'])
//       var posts = result.rss.channel[0].item
//       authors.forEach(author => {
//         author_code = ''
//         if (post["dc:creator"][0] == 'DeannaRilling' ||post["dc:creator"][0] == 'BethSchwartz'||post["dc:creator"][0] == 'elevatenv'||post["dc:creator"][0] == "elevateadmin"){
//           author_code = author_list[post["dc:creator"][0]]
//         }else{
//           author_code = post["dc:creator"][0]
//         }
//         var ref = db.collection('tests').doc(post["wp:post_name"][0])
//         batch.set(ref, {
//           author: author_code,
//           imageName: '',
//           imageUrl: '',
//           name: author['wp:author_display_name'][0],
//           posts: []
//         })
//       });
//       return batch.commit().then(function () {
//         console.log('authors added')
//       })
//       .catch(function(err) {
//         console.log('Error add authors', err);
//       });
//   });
// });

// ####################### get add new category #################
// var batch = db.batch();
// const postList = require('./old_all.json')
// console.log(postList.rss.channel[0].title[0])
// var categories_wp = postList.rss.channel[0]["wp:category"]
// var old_categories = []
// var current_categories = {}
// var new_categories = []
// categories_wp.forEach(category => {
//   old_categories.push(category["wp:cat_name"][0])
// })
// var categories_fb = db.collection('categories')
// var query = categories_fb.get()
//   .then(snapshot => {
//     snapshot.forEach(doc => {
//       var cat = doc.data()
//       current_categories[cat.label] = cat
//     })
//   })
//   .then(()=>{
//     var counter = 19
//     old_categories.forEach(cat => {
//       let name = cat.toLowerCase()
//       if(name in current_categories) {
        
//       }else{
//         var ref = db.collection('categories').doc(name.replace(' ','_'))
//         batch.set(ref, {
//           label: name,
//           value: counter
//         })
//         counter++
//       }
//     })
//     return batch.commit().then(function () {
//       console.log("saved")
//     })
//   })
//   .catch(err => {
//     console.log('Error getting documents', err);
//   });
// ###############################################################################



// ######################### get all and categories #####################
// var categories_json = {}
// var categories_fb = db.collection('categories')
// var query = categories_fb.get()
//   .then(snapshot => {
//     snapshot.forEach(doc => {
//       var cat = doc.data()
//       categories_json[cat.label] = cat
//     })
//     fs.writeFile("./categories.json", JSON.stringify(categories_json), function(err) {
//                 if(err) {
//                     return console.log(err);
//                 }
//                 console.log("The file was saved!");
//               });
//   })
//   .catch(err => {
//     console.log('Error getting documents', err);
//   });

// ############################################################################

// ######################### upload image ####################################
// var filepath = 'E:/ElevateNV/wetransfer-ad6a31/wp-content/uploads/2016/12/ARKANSAS-750x420.jpg'
// var destination = '/test/ARKANSAS-750x420.jpg'

var upload = (localFile, remoteFile) => {
  let uuid = UUID();
  return bucket.upload(localFile, {
        destination: remoteFile,
        uploadType: "media",
        metadata: {
          contentType: 'image/png',
          metadata: {
            firebaseStorageDownloadTokens: uuid
          }
        }
      })
      .then((data) => {
          let file = data[0];
          return Promise.resolve("https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid);
      })
      .catch((err) => {
        throw err
      })
}

// upload(filepath, destination)
//   .then(downloadURL => {
//     console.log(downloadURL)
//   })

// ############################################################################


// ################################ get all image path ##################################
// var reBuildPath = (path,size) => {
//   var slicePosition =  path.lastIndexOf('.')
//   var begin = path.slice(0,slicePosition)
//   var end = path.slice(slicePosition)
//   if (size == 0) {
//     return begin+'-750x420'+end
//   } else if(size == 1) {
//     return begin+'-360x200'+end
//   }
// }

// const imagemin = require('imagemin');
// const imageminJpegoptim = require('imagemin-jpegoptim');
// const imageminPngquant = require('imagemin-pngquant');

// var imageCompress = (imagePath) => {
//   var slicePosition =  imagePath.lastIndexOf('/')
//   var buildPath = imagePath.slice(0,slicePosition)
//   return imagemin([imagePath], buildPath, {
//           plugins: [
//             imageminJpegoptim({progressive: true, max: 80, stripAll:false}),
//             imageminPngquant({quality: '70'})
//           ]
//         }).then((files) => {
//           console.log('compress success')
//           return Promise.resolve(files)
//           //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
//         });
// }

// var testPosts = postList.rss.channel[0].item
// var imagePath = 'E:/ElevateNV/wetransfer-ad6a31'
// var imageList = {}
// //console.log(testPosts[0])


// const create_attachment_list = async () => {
//   await asyncForEach(testPosts, async (post) => {
//     if(post['wp:post_type'][0] == 'attachment'){
//       var image_small_path = reBuildPath(post['wp:attachment_url'][0].replace('https://elevatenv.com', imagePath), 1)
//       var image_large_path = reBuildPath(post['wp:attachment_url'][0].replace('https://elevatenv.com', imagePath), 0)
//       var image_normal_path = post['wp:attachment_url'][0].replace('https://elevatenv.com', imagePath)
//       // await imageCompress(image_small_path)
//       //   .then(message => {
//       //     console.log(message)
//       //   })
//       //   .catch((err) => {
//       //     console.log('got error',err)
//       //   })
//       // await imageCompress(image_large_path)
//       //   .then(message => {
//       //     console.log(message)
//       //   })
//       //   .catch((err) => {
//       //     console.log('got error',err)
//       //   })
//       // await imageCompress(image_normal_path)
//       //   .then(message => {
//       //     console.log(message)
//       //   })
//       //   .catch((err) => {
//       //     console.log('got error',err)
//       //   })
//       var data = {}
//       if (fs.existsSync(image_small_path)){
//         data['image_small_path'] = image_small_path
//       }
//       if (fs.existsSync(image_large_path)){
//         data['image_large_path'] = image_large_path
//       }
//       if (fs.existsSync(image_normal_path)){
//         data['image_normal_path'] = image_normal_path
//       }
//       data['post_parent'] = post['wp:post_parent'][0]
//       data['title'] = post['title'][0]
//       imageList[post['wp:post_parent'][0]] = data
//     }
//   })
//   fs.writeFile("./attachment.json", JSON.stringify(imageList), function(err) {
//     if(err) {
//         return console.log(err);
//     }
//     console.log("The file was saved!");
//   });
// };
// create_attachment_list()
// ####################################################################################

// async function asyncForEach(array, callback) {
//   for (let index = 0; index < array.length; index++) {
//     await callback(array[index], index, array)
//   }
// }


// var batch = db.batch();
// var result = []
// var noCat = []
// var posts = postList.rss.channel[0].item
// var onlyposts = []
// posts.forEach(post =>{
//   if(post['wp:post_type'][0] == 'post' && post['wp:status'][0] == 'publish'){
//     if(attachment[post['wp:post_id'][0]]){
//       onlyposts.push(post)
//     }
    
//   }
// })
// var firstThree = [onlyposts[50],onlyposts[100],onlyposts[150]]
// console.log(firstThree)
// var author_list = {
//     'DeannaRilling': 'Indwe3LYuUTISBvsLqvu',
//     'BethSchwartz': 'YVgHldSv3JLwuJiz24MP',
//     'elevatenv': 'aNLrxxrTs08mtC7I886G',
//     'elevateadmin': 'aNLrxxrTs08mtC7I886G'
//   }
// var nowDate = Date.now()

// const startImport = async () => {
//   await asyncForEach(posts, async (post) => {
    
    
    
//     if(post['wp:post_type'][0] == 'post' && post['wp:status'][0] == 'publish' && attachment[post['wp:post_id'][0]]) {
//       var data = {}
      
//       var image = attachment[post['wp:post_id'][0]]
//       console.log(post['wp:post_id'][0])
//       console.log(image)
//       var large_image_url = ''
//       var small_image_url = ''
//       var normal_image_url = ''
//       if( image['image_large_path']){
//         await upload(image['image_large_path'], image['image_large_path'].replace('E:/ElevateNV/wetransfer-ad6a31/wp-content/uploads/','/wpImage/'))
//         .then(downloadURL => {
//           large_image_url = downloadURL
//           console.log('in')
//         })
//         .catch((err) => {
//           console.log('got error',err)
//         })
//       } else if (image['image_normal_path']){
//         await upload(image['image_normal_path'], image['image_normal_path'].replace('E:/ElevateNV/wetransfer-ad6a31/wp-content/uploads/','/wpImage/'))
//         .then(downloadURL => {
//           normal_image_url = downloadURL
//           console.log('in')
//         })
//         .catch((err) => {
//           console.log('got error',err)
//         })
//       }

//       if( image['image_small_path']){
//         await upload(image['image_small_path'], image['image_small_path'].replace('E:/ElevateNV/wetransfer-ad6a31/wp-content/uploads/','/wpImage/'))
//         .then(downloadURL => {
//           small_image_url = downloadURL
//           console.log('in')
//         })
//         .catch((err) => {
//           console.log('got error',err)
//         })
//       } else if (image['image_normal_path']){
//         await upload(image['image_normal_path'], image['image_normal_path'].replace('E:/ElevateNV/wetransfer-ad6a31/wp-content/uploads/','/wpImage/'))
//         .then(downloadURL => {
//           normal_image_url = downloadURL
//           console.log('in')
//         })
//         .catch((err) => {
//           console.log('got error',err)
//         })
//       }

//       var author_code = ''
//       if (post["dc:creator"][0] == 'DeannaRilling' ||post["dc:creator"][0] == 'BethSchwartz'||post["dc:creator"][0] == 'elevatenv'||post["dc:creator"][0] == "elevateadmin"){
//         author_code = author_list[post["dc:creator"][0]]
//       }else{
//         author_code = post["dc:creator"][0]
//       }
      
//       var postDate = new Date(post['wp:post_date'][0])

//       var categories_list = {}
//       post['category'].forEach(category => {
//         if(categories[category['_'].toLowerCase()]){
//           categories_list[categories[category['_'].toLowerCase()].value] = postDate.valueOf()
//         }
//       })

//       data['author'] = author_code
//       data['categories'] = categories_list
//       data['content'] = post['content:encoded'][0]
//       data['createAt'] = postDate.valueOf()
//       if (large_image_url){
//         data['featureImageUrl'] = large_image_url
//       } else if(normal_image_url){
//         data['featureImageUrl'] = normal_image_url
//       }
//       if (small_image_url){
//         data['smallImageUrl'] = small_image_url
//       } else if(normal_image_url){
//         data['smallImageUrl'] = normal_image_url
//       }
//       var catKey = Object.keys(categories_list)[0]
//       var mainCat = {}
//       mainCat[catKey] = postDate.valueOf()
//       data['mainCategory'] = mainCat
      
//       data['postDate'] = postDate.valueOf()

//       const wordcount = post['content:encoded'][0].split(/\s+/).length
//       const readtime = Math.ceil(wordcount / 200)
//       data['readtime'] = readtime
//       data['wordcount'] = wordcount

//       data['shortname'] = post['link'][0].replace('https://elevatenv.com/','').replace('/','').substring(0, 50)
//       data['showFeatureImage'] = true
//       data['subtitle'] = post['excerpt:encoded'][0]
//       data['title'] = post['title'][0]
//       data['updateAt'] = []
//       result.push(data)
//       // var ref = db.collection('posts').doc(data['shortname'])
//       // batch.set(ref, data)
//     }
//   })
//   console.log(result)
//   // batch.commit().then(function () {
//   //         console.log("testPost saved")
//   //       })
//   fs.writeFile("./posts.json", JSON.stringify(result), function(err) {
//         if(err) {
//             return console.log(err);
//         }
//         console.log("The file was saved!");
//       });
// }

// startImport()

// posts.forEach(post => {
//   if(post['wp:post_type'][0] == 'post') {
//     var data = {}
    
//     var author_code = ''
//     if (post["dc:creator"][0] == 'DeannaRilling' ||post["dc:creator"][0] == 'BethSchwartz'||post["dc:creator"][0] == 'elevatenv'||post["dc:creator"][0] == "elevateadmin"){
//       author_code = author_list[post["dc:creator"][0]]
//     }else{
//       author_code = post["dc:creator"][0]
//     }
    
//     var categories_list = {}
//     post['category'].forEach(category => {
//       if(categories[category['_'].toLowerCase()]){
//         categories_list[categories[category['_'].toLowerCase()].value] = nowDate
//       }
//     })

//     data['author'] = author_code
//     data['categories'] = categories_list
//     data['content'] = post['content:encoded'][0]
//     data['createAt'] = nowDate
//     // data['featureImageUrl'] = 

//     var catKey = Object.keys(categories_list)[0]
//     var mainCat = {}
//     mainCat[catKey] = nowDate
//     data['mainCategory'] = mainCat
//     var postDate = new Date(post['wp:post_date'][0])
//     data['postDate'] = postDate.valueOf()

//     const wordcount = post['content:encoded'][0].split(/\s+/).length
//     const readtime = Math.ceil(wordcount / 200)
//     data['readtime'] = readtime
//     data['wordcount'] = wordcount

//     data['shortname'] = post['link'][0].replace('https://elevatenv.com/','').replace('/','').substring(0, 50)
//     data['showFeatureImage'] = true
//     data['subtitle'] = post['excerpt:encoded'][0]
//     data['title'] = post['title'][0]
//     data['updateAt'] = []
//     result.push(data)
//   }
// });

// console.log(result)

// ################################# upload posts #################################
var batch = db.batch();
console.log(formated_posts.length)
var sliced = formated_posts.slice(250)

sliced.forEach(post => {
  var ref = db.collection('posts').doc(post.shortname)
  batch.set(ref, {
    ...post
  })

})
batch.commit()
.then(function () {
  console.log("saved")
})
.catch((err)=> {
  console.log(err)
})