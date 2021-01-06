

module.exports.upload = function (req, res) {

    var fileRows = [];

    var val = 0;
    var header = ["date", "url", "headline", "author", "source", "potential_reach", "keywords"];
    var footer = [];

    console.log("yooooo",req.files[0].path)

    csv
        .parseFile(req.file.path)
        .on("data", function (data) {

            if (val == 0) {

                footer = data.map(function (column) { return column.trim(); });
                var names = data.map(function (column) { return column.trim(); });

                if (header.length === names.length && header.sort().every(function (value, index) { return value === names.sort()[index] })) {
                    console.log("it's a match!!!")
                    val = 1;
                }

            } else {
                console.log(data)
                fileRows.push(data);
                console.log(fileRows)
            }

        })
        .on("end", async function () {

            if (val == 0) {
                res.json("ERROR : Use the article upload template!!");
                console.log("FAILURE!!!")
            } else {
                try {
                    result = await processArticleData(fileRows, footer, req.params.project_id);
                    console.log(result);
                    res.json(result);
                } catch (err) {
                    console.log(err);
                    res.json(err);
                }
                var uploadInfo = {
                    localPath: req.file.destination,
                    fileName: req.file.filename,
                    bucket: 'hypatia-files',
                    folderPath: 'uploaded/articles'
                }

                S3.uploadFile(uploadInfo, function (S3err, S3data) {
                    if (S3err) {
                        console.log(S3err);
                    }
                    console.log('File uploaded successfully at', S3data.Location)
                    //fs.unlinkSync(req.file.path);
                });
            }
        });
}

processArticleData = async function (fileRows, footer, project_id) {
    return new Promise(async function (resolve, reject) {

        for (const data of fileRows) {
            if (data[footer.indexOf('url')] != '') {
                try {
                    var newDate = null;
                    newDate = new Date(data[footer.indexOf('date')]).toISOString().substr(0, 10);
                } catch (err) {
                    reject(err);
                }
                var input = {
                    article_id: null,
                    person_id: null,
                    outlet_id: null,
                    user_id: 'ebin1995-681a-11ea-b0f2-a3065bee3b10',
                    project_id: project_id,
                    date: newDate,
                    url: data[footer.indexOf('url')],
                    headline: data[footer.indexOf('headline')],
                    author_f_name: data[footer.indexOf('author')].trim().split(' ').slice(0, 1).join(' ').trim(),
                    author_l_name: data[footer.indexOf('author')].trim().split(' ').slice(1).join(' ').trim(),
                    outlet_name: data[footer.indexOf('source')],
                    potential_reach: data[footer.indexOf('potential_reach')],
                    keywords: data[footer.indexOf('keywords')]
                }
                try {
                    result = await ARTICLE.uploadArticle(input);
                    console.log(result);
                } catch (err) {
                    reject(err);
                }
            }

        }
        resolve("SUCCESS : All articles in file have been uploaded to the database.")
    });
}

