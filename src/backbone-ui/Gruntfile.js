module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-qunit');

	grunt.registerTask('test', 'qunit');

	grunt.initConfig({
		qunit: {
			files: ['test/test.html']
		}
	});
};