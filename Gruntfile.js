module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	//Project configuration.
	grunt.initConfig({
		browserify: {
      dev: {
        options: {
          debug: true
        },
        files:{
          'pages/index.built.js' : 'pages/index.js'
        }
      }
    },
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'css/screen.css': 'scss/screen.scss'
        }
      }
    },
		watch: {
      js: {
        files: ['pages/index.js'],
        tasks: ['browserify:dev']
      },
      css: {
        files: ['scss/*.scss'],
        tasks: ['sass']
      }
    }
	});

	//Task(s).
	grunt.registerTask('default', ['browserify', 'sass']);
  grunt.registerTask('debug', ['watch']);

}