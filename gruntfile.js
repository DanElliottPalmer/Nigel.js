module.exports = function(grunt){

	grunt.initConfig({
		"pkg": grunt.file.readJSON("package.json"),
		"uglify": {
			"dist": {
				"files": {
					'lib/min/core.min.js': ['lib/core.js'],
					'lib/min/json.min.js': ['lib/json.js'],
					'lib/min/xml.min.js': ['lib/xml.js'],
					'lib/min/dsv.min.js': ['lib/dsv.js'],
					'lib/min/all.min.js': ['lib/core.js', 'lib/json.js', 'lib/xml.js', 'lib/dsv.js']
				}
			}
		},
		"watch": {
			"files": ['lib/*.js'],
			"tasks": ["default"]
		}
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask("default", ["uglify"]);

};