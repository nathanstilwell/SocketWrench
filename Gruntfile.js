/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      },
      spec: {
        src: ['spec/**/*.js']
      }
    },

    connect: {
      spec: {
        options: {
          port: 9898
        }
      }
    },

    jasmine: {
      taskName: {
        src: [ 'lib/**/*.js', 'vendor/sinon-1.7.3.js' ],
        options: {
          specs: 'spec/*.js'
        }
      }
    },

    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'test']
      },
      spec: {
        files: '<%= jshint.spec.src %>',
        tasks: ['jshint:spec', 'test']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['jasmine']);

  // Default task.
  grunt.registerTask('default', ['connect', 'watch', 'test']);
};
