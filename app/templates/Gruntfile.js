module.exports = function(grunt) {

	grunt.initConfig({
		vars: {
            public: 'public/assets/',
            src: 'src'
		},
		pkg: grunt.file.readJSON('package.json'),
        concurrent: {
            options: {
                logConcurrentOutput: true,
                limit: 6
            },
            default: ['watch:sass','watch:js','watch:html','watch:img','watch:livereload']
        },
		watch: {
            html: {
                files: ['<%= vars.src %>/html/**/*.html'],
                tasks: ['bake']
            },
			sass: {
				files: ['<%= vars.src %>/sass/**/*.scss'],       
				tasks: ['sass']
			},
            js: {
                files: ['<%= vars.src %>/js/*.js'],
                tasks: ['uglify']
            },
            img: {
                files: ['<%= vars.src %>/img/*'],
                tasks: ['newer:copy','newer:imageoptim']
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: [
                    '<%= vars.public %>/*.html',
                    '<%= vars.public %>/css/*.css',
                    '<%= vars.public %>/js/{,*/}*.js',
                    '<%= vars.public %>/img/{,*/}*.{png,jpg,jpeg,svg,gif,webp}'
                ]
            }
		},
        bake: {
            build: {
                files: [ {
                    expand: true,
                    cwd: '<%= vars.src %>/html/',
                    src: ['*.html'],
                    dest: 'public/',
                    ext: '.html'
                } ]
            },
        },
		sass: {
		  dist: {
              options: {
				outputStyle: 'compressed',
				trace: true,
				sourceMap: true
			},
		    files: {
		      '<%= vars.public %>/css/style.css': '<%= vars.src %>/sass/style.scss'
		    }
		  }
		},
		uglify: {
			footer: {
				options: {
					sourceMap: '<%= vars.public %>/js/scripts-footer.min.js.map',
					sourceMpublicingURL: 'scripts-footer.min.js.map',
					sourceMapRoot: '..',
					mangle: true,
					compress: true
				},
				src: [ '<%= vars.src %>/js/*.js' ],
				dest: '<%= vars.public %>/js/scripts-footer.min.js' 
			}
		},
        copy: {
            files: {
                expand: true, 
                cwd: '<%= vars.src %>/',
                src: '**',
                dest: '<%= vars.public %>/'
            }
        },
        imageoptim: {
            dist: {
                src: ['<%= vars.public %>/img']
            }
        },
	});	

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('local', ['concurrent']);
};
