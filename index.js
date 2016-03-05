'use strict';

var path = require('path');
var fs = require('fs');
var jade = require('jade');
var cheerio = require('cheerio');

var filePath = process.env.FILE || '/Users/user/Downloads/ListaExercitiiFitness.txt';
var imagesPath = process.env.IMAGES || '/Users/user/Downloads/ListaExercitiiFitness/images';

function getItems(content) {
	var $ = cheerio.load(fs.readFileSync(path.join(imagesPath, '../ListaExercitiiFitness.html')));
	var images = $('body img').map(function() {
		return path.join(imagesPath, $(this).attr('src').replace('images/', ''));
	});

	var items = content.split(/[\n]/g)
		.map(function(item) {
			return item.replace(/[\s]{2,}/g, ' ').trim().replace(/^\d+\./, '').trim();
		});
	items = items.filter(function(item) {
		return item.length > 2;
	});

	items = items.map(function(item, i) {
		var one = {
			title: item,
			image: images[i]
		};

		var title = one.title.split(/\//g);
		if (title.length > 1) {
			one.subtitle = title[title.length - 1].trim();
			title.splice(title.length - 1, 1);
			one.title = title.join('/').trim();
		}

		return one;
	});

	return items;
}

function generate() {
	var fileContent = fs.readFileSync(filePath).toString();

	var items = getItems(fileContent);

	var html = jade.renderFile('layout.jade', { items: items });

	fs.writeFileSync('page.html', html);
}

generate();
