
var mysql = require('mysql');
var database = require('../databases/awsRDS.js');


module.exports.selectAll = function (table, callback) {

    let selectQuery = 'SELECT * FROM ??';
    var query = mysql.format(selectQuery, [table]);
    console.log(query);

    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
}

module.exports.selectWhere1 = function (table, column, value, callback) {

    let selectQuery = 'SELECT * FROM ?? WHERE ?? = ?';
    var query = mysql.format(selectQuery, [table, column, value]);
    query = query.replace(/= NULL/gi, "IS NULL");
    console.log(query);

    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
}

module.exports.selectWhere2 = function (table, column1, value1, column2, value2, callback) {

    let selectQuery = 'SELECT * FROM ?? WHERE ?? = ? AND ?? = ?';
    var query = mysql.format(selectQuery, [table, column1, value1, column2, value2]);
    query = query.replace(/= NULL/gi, "IS NULL");
    console.log(query);

    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
}

module.exports.insertRow = function (table, newData, callback) {

    var size = Object.keys(newData).length
    var col = ",??"
    var val = ",?"

    let insertQuery = 'INSERT INTO ?? (??' + col.repeat(size - 1) + ') VALUES (?' + val.repeat(size - 1) + ')';
    var sqlArray = [table].concat(Object.keys(newData)).concat(Object.values(newData));

    let query = mysql.format(insertQuery, sqlArray);
    console.log(query);

    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
}


module.exports.updateRowValue = function (table, column1, value1, column2, value2, callback) {

    let updateQuery = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    var query = mysql.format(updateQuery, [table, column1, value1, column2, value2]);
    console.log(query);

    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
}


module.exports.updateRowValue2 = function (table, column1, value1, column2, value2, column3, value3, callback) {

    let updateQuery = "UPDATE ?? SET ?? = ? WHERE ?? = ? AND ?? = ?";
    var query = mysql.format(updateQuery, [table, column1, value1, column2, value2, column3, value3]);
    console.log(query);

    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
}


module.exports.updateRowValue1_IgnoreDupes = function (table, column1, value1, column2, value2, callback) {

    let updateQuery = "UPDATE IGNORE ?? SET ?? = ? WHERE ?? = ?";
    var query = mysql.format(updateQuery, [table, column1, value1, column2, value2]);
    console.log(query);

    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
}


module.exports.updateRowValue2_IgnoreDupes = function (table, column1, value1, column2, value2, column3, value3, callback) {

    let updateQuery = "UPDATE IGNORE ?? SET ?? = ? WHERE ?? = ? AND ?? = ?";
    var query = mysql.format(updateQuery, [table, column1, value1, column2, value2, column3, value3]);
    console.log(query);

    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
}
 

module.exports.updateRowWhere1 = function (table, newData, column, value, callback) {

    var size = Object.keys(newData).length
    var edit = ", ?? = ?"

    let updateQuery = 'UPDATE ?? SET ?? = ?' + edit.repeat(size - 2) + ' WHERE ?? = ?';
    delete newData[column]
    var flat = [].concat.apply([], Object.entries(newData))
    var sqlArray = [table].concat(flat).concat(column).concat(value);

    var query = mysql.format(updateQuery, sqlArray);
    console.log(query);

    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
}


module.exports.updateRowWhere2 = function (table, newData, column1, value1, column2, value2, callback) {

    var size = Object.keys(newData).length
    var edit = ", ?? = ?"

    let updateQuery = 'UPDATE ?? SET ?? = ?' + edit.repeat(size - 3) + ' WHERE ?? = ? AND ?? = ?';
    delete newData[column1]
    delete newData[column2]
    var flat = [].concat.apply([], Object.entries(newData))
    var sqlArray = [table].concat(flat).concat(column1).concat(value1).concat(column2).concat(value2);

    var query = mysql.format(updateQuery, sqlArray);
    console.log(query);

    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
}


module.exports.deleteRowWhere1 = function (table, column, value, callback) {

    let deleteQuery = "DELETE from ?? where ?? = ?";
    let query = mysql.format(deleteQuery, [table, column, value]);
    console.log(query);

    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
}


module.exports.deleteRowWhere2 = function (table, column1, value1, column2, value2, callback) {

    let deleteQuery = "DELETE from ?? where ?? = ? AND ?? = ?";
    let query = mysql.format(deleteQuery, [table, column1, value1, column2, value2]);
    console.log(query);

    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
}


module.exports.copyOutlets = function (new_project_id, old_project_id, callback) {

    let copyQuery = "INSERT INTO `project_outlets` (`project_id`, `outlet_id`, `med_tier`) \
    SELECT ?, `outlet_id`, `med_tier` FROM `project_outlets` WHERE `project_id` = ?;";
    
    let query = mysql.format(copyQuery, [new_project_id, old_project_id]);
    console.log(query);

    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
}


module.exports.copyArticles = function (new_project_id, old_project_id, param, callback) {

    if (param == 'true') {
        var copyQuery = "INSERT INTO `project_articles` (`project_id`, `article_id`, `keywords`, `status`) \
        SELECT ?, `article_id`, `keywords`, 'not coded' FROM `project_articles` WHERE `project_id` = ?";
    }
    else {
        var copyQuery = "INSERT INTO `project_articles` (`project_id`, `article_id`, `keywords`, `status`) \
        SELECT ?, `article_id`, `keywords`, 'not coded' FROM `project_articles` WHERE `project_id` = ? AND `status` != 'completed'";
    }

    let query = mysql.format(copyQuery, [new_project_id, old_project_id]);
    console.log(query);

    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
}


module.exports.selectOutletsWhere = function (project_id, callback) {

    let outletsQuery = 'SELECT `project_id`, `outlets`.`outlet_id`,  `outlet_name`, `med_type`, `med_tier` \
    FROM `outlets` \
    LEFT JOIN `project_outlets` ON `outlets`.`outlet_id` = `project_outlets`.`outlet_id` \
    WHERE `project_id` = ?';
    var query = mysql.format(outletsQuery, [project_id]);
    console.log(query);

    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
}


module.exports.selectProjectTags = function (project_id, callback) {

    let tagsQuery = 'SELECT GROUP_CONCAT(DISTINCT `tag` ORDER BY `tag` ASC SEPARATOR \', \') AS `project_tags` \
    FROM `project_tags` LEFT JOIN `tags` ON `project_tags`.`tag_id` = `tags`.`tag_id` \
    WHERE `project_id` = ?';
    var query = mysql.format(tagsQuery, [project_id]);
    console.log(query);

    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
}


module.exports.selectInfluencerTypes = function (project_id, callback) {

    let influencerTypesQuery = 'SELECT GROUP_CONCAT(DISTINCT `influencer_type` ORDER BY `influencer_type` ASC SEPARATOR \', \') AS `influencer_types` \
    FROM `project_influencer_types` LEFT JOIN `influencer_types` ON `project_influencer_types`.`influencer_type_id` = `influencer_types`.`influencer_type_id` \
    WHERE `project_id` = ?';
    var query = mysql.format(influencerTypesQuery, [project_id]);
    console.log(query);

    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
}


module.exports.selectObjectsWhere = function (project_id, callback) {

    let objectsQuery = 'SELECT `object_id`, `brand_name`, `nickname`, `parent_company`, `product_name`, `objects`.`brand_id`, `objects`.`product_id`, `lt_client`, `code_for` \
    FROM `objects` \
    LEFT JOIN `brands` ON `objects`.`brand_id` = `brands`.`brand_id` \
    LEFT JOIN `products` ON `objects`.`product_id` = `products`.`product_id` \
    WHERE `project_id` = ? \
    ORDER BY `product_name` ASC';
    var query = mysql.format(objectsQuery, [project_id]);
    console.log(query);

    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
}


module.exports.selectArticlesWhere = function (project_id, callback) {

    let articlesQuery = 'SELECT `project_articles`.`project_id`, `articles`.`article_id`, `outlets`.`outlet_id`, `persons`.`person_id`, `date_published`, \
    `url`, `headline`, `potential_reach`, `outlet_name`, `med_tier`, `first_name`, `last_name`, `keywords`, `coding_notes`, `status`, `coded_by` \
    \
    FROM `articles` \
    LEFT JOIN `outlets` ON `articles`.`outlet_id` = `outlets`.`outlet_id` \
    LEFT JOIN `persons` ON `articles`.`person_id` = `persons`.`person_id` \
    LEFT JOIN `project_articles` ON `articles`.`article_id` = `project_articles`.`article_id` \
    LEFT JOIN `project_outlets` ON `project_articles`.`project_id` = `project_outlets`.`project_id` AND `articles`.`outlet_id` = `project_outlets`.`outlet_id` \
    \
    WHERE `project_articles`.`project_id` = ?'

    var query = mysql.format(articlesQuery, [project_id]);
    console.log(query);

    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
}


module.exports.selectProjects = function (callback) {

    let projectsQuery = 'SELECT `original`.`project_id`, `project_name`, `user_id`, `date_created`, \
    `num_outlets`, `num_articles`, `num_coded_articles`, `num_mentions`, `objects`, `tags`, `influencer_types` \
    \
    FROM (SELECT * FROM `projects`) AS `original` \
    \
    LEFT JOIN (SELECT `project_id`, COUNT(`article_id`) AS `num_articles` FROM `project_articles` GROUP BY `project_id`) \
    AS `art_num` ON `original`.`project_id` = `art_num`.`project_id` \
    \
    LEFT JOIN (SELECT `project_id`, COUNT(`article_id`) AS `num_coded_articles` FROM `project_articles` WHERE `status` = \'completed\' GROUP BY `project_id`) \
    AS `cod_art_num` ON `original`.`project_id` = `cod_art_num`.`project_id` \
    \
    LEFT JOIN (SELECT `project_id`, COUNT(`outlet_id`) AS `num_outlets` FROM `project_outlets` GROUP BY `project_id`) \
    AS `out_num` ON `original`.`project_id` = `out_num`.`project_id` \
    \
    LEFT JOIN (SELECT `project_id`, COUNT(`mention_id`) AS `num_mentions` FROM `mentions` GROUP BY `project_id`) \
    AS `men_num` ON `original`.`project_id` = `men_num`.`project_id` \
    \
    LEFT JOIN (SELECT `project_id`, GROUP_CONCAT(DISTINCT `tag` ORDER BY `tag` ASC SEPARATOR \', \') AS `tags` \
    FROM `project_tags` LEFT JOIN `tags` ON `project_tags`.`tag_id` = `tags`.`tag_id` \
    GROUP BY `project_id`) \
    AS `pro_tags` ON `original`.`project_id` = `pro_tags`.`project_id` \
    \
    LEFT JOIN (SELECT `project_id`, GROUP_CONCAT(DISTINCT `influencer_type` ORDER BY `influencer_type` ASC SEPARATOR \', \') AS `influencer_types` \
    FROM `project_influencer_types` LEFT JOIN `influencer_types` ON `project_influencer_types`.`influencer_type_id` = `influencer_types`.`influencer_type_id` \
    GROUP BY `project_id`) \
    AS `pro_influencer_types` ON `original`.`project_id` = `pro_influencer_types`.`project_id` \
    \
    LEFT JOIN (SELECT `project_id`, GROUP_CONCAT(DISTINCT `object` SEPARATOR \', \') AS `objects` \
    FROM (SELECT `project_id`,`brand_name` AS `object` FROM `objects` LEFT JOIN `brands` ON `objects`.`brand_id` = `brands`.`brand_id` \
    UNION \
    SELECT `project_id`,`product_name` AS `object` FROM `objects` LEFT JOIN `products` ON `objects`.`product_id` = `products`.`product_id`) \
    AS `objects_elements` GROUP BY `project_id`) \
    AS `pro_objects` ON `original`.`project_id` = `pro_objects`.`project_id`';

    var query = projectsQuery;
    console.log(query);

    database.pool.query(projectsQuery, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
}
 

module.exports.selectResults = function (project_id, callback) {

    let resultsQuery = 'SELECT `p_mentions`.`mention_id`, `p_mentions`.`project_id`, `user_id`, `coded_by`, `verified`, `p_mentions`.`article_id`, `date_published`, `url`, \
    `headline`, `potential_reach`, `outlet_id`, `outlet_name`, `med_type`, `med_tier`, `person_id`, `author_name`, `p_mentions`.`object_id`, `brand_name`, `product_name`, `lt_client`, \
    `code_for`, `p_mentions`.`line_id`, `tone` AS `tone_score`, `tone`, `mentions`, `prominence`, `visual`, `link`, `supporters`, `visibility`, `quality`, `gravity_score`, `kpis` \
    \
    FROM (SELECT `mention_id`, `project_id`, `user_id`, `object_id`, `article_id`, `line_id`, `verified` \
    FROM `mentions` WHERE `project_id` = ?) \
    AS `p_mentions` \
    \
    LEFT JOIN \
    (SELECT `project_articles`.`project_id`, `coded_by`, `articles`.`article_id`, `outlets`.`outlet_id`, `persons`.`person_id`, `date_published`, `url`, \
    `headline`, `potential_reach`, `outlet_name`, `med_type`, `med_tier`, CONCAT(`first_name`, \' \', COALESCE(`last_name`, \'\')) AS `author_name` \
    FROM `articles` \
    LEFT JOIN `outlets` ON `articles`.`outlet_id` = `outlets`.`outlet_id` \
    LEFT JOIN `persons` ON `articles`.`person_id` = `persons`.`person_id` \
    LEFT JOIN `project_articles` ON `articles`.`article_id` = `project_articles`.`article_id` \
    LEFT JOIN `project_outlets` ON `project_articles`.`project_id` = `project_outlets`.`project_id` AND `articles`.`outlet_id` = `project_outlets`.`outlet_id` \
    WHERE `project_articles`.`project_id` = ? ) \
    AS `m_articles` ON `p_mentions`.`article_id`=`m_articles`.`article_id` \
    \
    LEFT JOIN \
    (SELECT `object_id`, `project_id`, `lt_client`, `code_for`, `brand_name`, `product_name` FROM `objects` \
    LEFT JOIN `brands` ON `objects`.`brand_id`=`brands`.`brand_id` \
    LEFT JOIN `products` ON `objects`.`product_id`=`products`.`product_id` \
    WHERE `objects`.`project_id` = ? ) \
    AS `m_objects` ON `p_mentions`.`object_id`=`m_objects`.`object_id` \
    \
    LEFT JOIN `m_lines` ON `p_mentions`.`line_id`=`m_lines`.`line_id` \
    \
    LEFT JOIN \
    (SELECT `line_id`, GROUP_CONCAT(`supporter` SEPARATOR \' ||| \') AS `supporters` FROM \
    (SELECT `line_id`, CONCAT(`persons`.`person_id`, \' >> \', `first_name`, \' \', COALESCE(`last_name`,\'\'), \' >> \', COALESCE(`per_notes`,\'\'), \' >> \', `person_type`, \' >> \', `support`) as `supporter` \
    FROM `reputation` JOIN `persons` ON `reputation`.`person_id`=`persons`.`person_id` \
    ORDER BY `supporter` ASC) \
    AS `m_supporter` GROUP BY `line_id`) \
    AS `m_supporters` ON `p_mentions`.`line_id`=`m_supporters`.`line_id` \
    \
    LEFT JOIN \
    (SELECT `mention_id`, GROUP_CONCAT(`kpi` SEPARATOR \' ||| \') AS `kpis` \
    FROM \
    \
    (SELECT `mention_id` , CONCAT(\'object_kpi >> \', `object_kpi_value`.`object_kpi_id`, \' >> \', `kpi_type`, \' >> \', `ok_heading`, \' >> \', `ok_value`) AS `kpi` \
    FROM `object_kpi_value` \
    LEFT JOIN `object_kpis` ON `object_kpi_value`.`object_kpi_id`=`object_kpis`.`object_kpi_id` \
    LEFT JOIN `kpis` ON `object_kpis`.`kpi_id`= `kpis`.`kpi_id` \
    \
    UNION \
    \
    SELECT `mention_id` , CONCAT(\'project_kpi >> \', `project_kpi_value`.`project_kpi_id`, \' >> \', `kpi_type`, \' >> \', `pk_heading`, \' >> \', `pk_value`) AS `kpi` \
    FROM `project_kpi_value` \
    LEFT JOIN `project_kpis` ON `project_kpi_value`.`project_kpi_id`=`project_kpis`.`project_kpi_id` \
    LEFT JOIN `kpis` ON `project_kpis`.`kpi_id`= `kpis`.`kpi_id` \
    \
    UNION \
    \
    SELECT `mention_id` , CONCAT(\'article_kpi >> \', `article_kpi_value`.`article_kpi_id`, \' >> \', `kpi_type`, \' >> \', `ak_heading`, \' >> \', `ak_value`) AS `kpi` \
    FROM `article_kpi_value` \
    LEFT JOIN `article_kpis` ON `article_kpi_value`.`article_kpi_id`=`article_kpis`.`article_kpi_id` \
    LEFT JOIN `kpis` ON `article_kpis`.`kpi_id`= `kpis`.`kpi_id` \
    ) \
    \
    AS `m_kpi` GROUP BY `mention_id`) \
    AS `m_kpis` ON `p_mentions`.`mention_id`=`m_kpis`.`mention_id` \
    \
    LEFT JOIN `hypatia` ON `p_mentions`.`line_id`=`hypatia`.`line_id`'

    var query = mysql.format(resultsQuery, [project_id, project_id, project_id]);
    console.log(query);


    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
    
}



module.exports.selectResult = function (project_id, article_id, callback) {

    let resultsQuery = 'SELECT `p_mentions`.`mention_id`, `p_mentions`.`project_id`, `user_id`, `coded_by`, `p_mentions`.`article_id`, `date_published`, `url`, `headline`, `potential_reach`, \
    `outlet_id`, `outlet_name`, `med_type`, `med_tier`, `person_id`, `author_name`, `p_mentions`.`object_id`, `brand_name`, `product_name`, `lt_client`, `code_for`, \
    `p_mentions`.`line_id`, `tone` AS `tone_score`, `tone`, `mentions`, `prominence`, `visual`, `link`, `supporters`, `visibility`, `quality`, `gravity_score`, `kpis` \
    \
    FROM (SELECT `mention_id`, `project_id`, `user_id`, `object_id`, `article_id`, `line_id` \
    FROM `mentions` WHERE `project_id` = ? \
    AND `mentions`.`article_id` = ?) \
    AS `p_mentions` \
    \
    LEFT JOIN \
    (SELECT `project_articles`.`project_id`, `coded_by`, `articles`.`article_id`, `outlets`.`outlet_id`, `persons`.`person_id`, `date_published`, `url`, \
    `headline`, `potential_reach`, `outlet_name`, `med_type`, `med_tier`, CONCAT(`first_name`, \' \', COALESCE(`last_name`, \'\')) AS `author_name` \
    FROM `articles` \
    LEFT JOIN `outlets` ON `articles`.`outlet_id` = `outlets`.`outlet_id` \
    LEFT JOIN `persons` ON `articles`.`person_id` = `persons`.`person_id` \
    LEFT JOIN `project_articles` ON `articles`.`article_id` = `project_articles`.`article_id` \
    LEFT JOIN `project_outlets` ON `project_articles`.`project_id` = `project_outlets`.`project_id` AND `articles`.`outlet_id` = `project_outlets`.`outlet_id` \
    WHERE `project_articles`.`project_id` = ? ) \
    AS `m_articles` ON `p_mentions`.`article_id`=`m_articles`.`article_id` \
    \
    LEFT JOIN \
    (SELECT `object_id`, `project_id`, `lt_client`, `code_for`, `brand_name`, `product_name` FROM `objects` \
    LEFT JOIN `brands` ON `objects`.`brand_id`=`brands`.`brand_id` \
    LEFT JOIN `products` ON `objects`.`product_id`=`products`.`product_id` \
    WHERE `objects`.`project_id` = ? ) \
    AS `m_objects` ON `p_mentions`.`object_id`=`m_objects`.`object_id` \
    \
    LEFT JOIN `m_lines` ON `p_mentions`.`line_id`=`m_lines`.`line_id` \
    \
    LEFT JOIN \
    (SELECT `line_id`, GROUP_CONCAT(`supporter` SEPARATOR \' ||| \') AS `supporters` FROM \
    (SELECT `line_id`, CONCAT(`persons`.`person_id`, \' >> \', `first_name`, \' \', COALESCE(`last_name`,\'\'), \' >> \', COALESCE(`per_notes`,\'\'), \' >> \', `person_type`, \' >> \', `support`) as `supporter` \
    FROM `reputation` JOIN `persons` ON `reputation`.`person_id`=`persons`.`person_id` \
    ORDER BY `supporter` ASC) \
    AS `m_supporter` GROUP BY `line_id`) \
    AS `m_supporters` ON `p_mentions`.`line_id`=`m_supporters`.`line_id` \
    \
    LEFT JOIN \
    (SELECT `mention_id`, GROUP_CONCAT(`kpi` SEPARATOR \' ||| \') AS `kpis` \
    FROM \
    \
    (SELECT `mention_id` , CONCAT(\'object_kpi >> \', `object_kpi_value`.`object_kpi_id`, \' >> \', `kpi_type`, \' >> \', `ok_heading`, \' >> \', `ok_value`) AS `kpi` \
    FROM `object_kpi_value` \
    LEFT JOIN `object_kpis` ON `object_kpi_value`.`object_kpi_id`=`object_kpis`.`object_kpi_id` \
    LEFT JOIN `kpis` ON `object_kpis`.`kpi_id`= `kpis`.`kpi_id` \
    \
    UNION \
    \
    SELECT `mention_id` , CONCAT(\'project_kpi >> \', `project_kpi_value`.`project_kpi_id`, \' >> \', `kpi_type`, \' >> \', `pk_heading`, \' >> \', `pk_value`) AS `kpi` \
    FROM `project_kpi_value` \
    LEFT JOIN `project_kpis` ON `project_kpi_value`.`project_kpi_id`=`project_kpis`.`project_kpi_id` \
    LEFT JOIN `kpis` ON `project_kpis`.`kpi_id`= `kpis`.`kpi_id` \
    \
    UNION \
    \
    SELECT `mention_id` , CONCAT(\'article_kpi >> \', `article_kpi_value`.`article_kpi_id`, \' >> \', `kpi_type`, \' >> \', `ak_heading`, \' >> \', `ak_value`) AS `kpi` \
    FROM `article_kpi_value` \
    LEFT JOIN `article_kpis` ON `article_kpi_value`.`article_kpi_id`=`article_kpis`.`article_kpi_id` \
    LEFT JOIN `kpis` ON `article_kpis`.`kpi_id`= `kpis`.`kpi_id` \
    ) \
    \
    AS `m_kpi` GROUP BY `mention_id`) \
    AS `m_kpis` ON `p_mentions`.`mention_id`=`m_kpis`.`mention_id` \
    \
    LEFT JOIN `hypatia` ON `p_mentions`.`line_id`=`hypatia`.`line_id`'

    var query = mysql.format(resultsQuery, [project_id, article_id, project_id, project_id]);
    console.log(query);


    database.pool.query(query, function (err, data) {
        if (typeof callback == "function") {
            callback(err, data);
        }
    });
    
}








