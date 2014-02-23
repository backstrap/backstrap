require 'rubygems'
require 'rkelly'
require 'closure-compiler'
require 'yui/compressor'

def filename(path)
  name = path[(path.rindex('/') + 1)..-1]
  name = name[0..(name.rindex '.') -1]
end

desc "build the backbone-ui-min.js file for distribution"
task :build do
  puts 'generating distribution'

  `rm -rf dist/*`
  `mkdir -p dist`

  css_source_files = Dir.entries("./src/css").find_all do |source_file|
    source_file.match /\.css$/
  end
  File.open('dist/backbone-ui.css', 'w+') do |dev_file|
    css_source_files.each do |source_file|
      source = File.read './src/css/' + source_file
      dev_file.write source
    end
  end

  compressor = YUI::CssCompressor.new
  source = File.read('dist/backbone-ui.css')
  File.open('dist/backbone-ui-min.css', 'w+') do |file|
    file.write compressor.compress(source)
  end

  js_source_files = Dir.entries("./src/js").find_all do |source_file|
    source_file.match /\.js$/
  end

  File.open('dist/backbone-ui.js', 'w+') do |dev_file|
    js_source_files.each do |source_file|
      source = File.read './src/js/' + source_file
      dev_file.write source
    end
  end
 
  source = File.read 'dist/backbone-ui.js'
  File.open('dist/backbone-ui-min.js', 'w+') do |file|
    file.write Closure::Compiler.new.compress(source)
  end

  `tar -cvzf dist/backbone-ui-min.tar.gz dist/backbone-ui-min.js dist/backbone-ui-min.css`
  `tar -cf dist/backbone-ui.tar dist/backbone-ui.js dist/backbone-ui.css`
  `gzip -vc dist/backbone-ui.tar > dist/backbone-ui.tar.gz`
  `rm dist/backbone-ui-min.js`
  `rm dist/backbone-ui-min.css`
end


desc "generate the documentation in doc/dist"
task :doc  => [:build] do 
  puts 'generating documentation'
  `rm -rf doc/dist/*`
  `mkdir -p doc/dist`

  def build_script_tags(dirs)
    dirs.map do |dir|
      (Dir.glob("#{dir}/**/*.js")).map do |file|
        "<script src='./#{file}' type='text/javascript'></script>"
      end
    end
  end

  def build_css_tags(dirs)
    dirs.map do |dir|
      (Dir.glob("#{dir}/**/*.css")).map do |file|
        "<link rel='stylesheet' type='text/css' href='./#{file}'>"
      end
    end
  end

  def collect_option_comments(filename)
    return {} unless File.exists?(filename)
    js = File.read(filename)

    parser = RKelly::Parser.new
    ast = parser.parse(js);

    options_node = nil
    ast.each do |node|
      if node.kind_of? RKelly::Nodes::PropertyNode and node.name == 'options'
        options_node = node.value
        break
      end
    end

    options = {}
    comments = []
    (options_node || []).each do |node|
      node.comments.each { |comment| comments << comment.value.gsub(/^\/\//, '') }
      if node.kind_of? RKelly::Nodes::PropertyNode
        if comments.length > 0
          options[node.name.to_sym] = comments.join
          comments = []
        end
      end
    end

    options
  end

  def build_options(map)
    return '' unless map.length > 0
    options_markup = map.keys.map do |key|
      "<li><div class='key'>#{key}</div><div class='value'>#{map[key]}</div></li>"
    end
    "<div class='options'><h2>Options</h2><ul>#{options_markup.join}</ul></div>"
  end

  def build_components(dir)
    Dir.glob("#{dir}/**/*.html").map do |file|

      name = filename(file)
      name = "src/js/#{name}.js"

      map = collect_option_comments(name)
      options_markup = build_options(map) || ''
      content = File.read(file)
      content.gsub!('<!-- OPTIONS -->', options_markup)

      content
    end.join("\n")
  end

  src = File.read('doc/src/index.html')

  # insert script and style tags
  src.gsub!('<!-- JS -->', build_script_tags(['lib/required', 'lib/optional', 'src/js']).join("\n"))
  src.gsub!('<!-- CSS -->', build_css_tags(['lib', 'src/css']).join("\n"))

  src.gsub!('<!-- MODEL_OPTIONS -->', 
    build_options(collect_option_comments('src/js/has_model.js')))

  src.gsub!('<!-- MODEL_COLLECTION_OPTIONS -->', 
    build_options(collect_option_comments('src/js/has_alternative_property.js')))

  src.gsub!('<!-- COLLECTION_OPTIONS -->', 
    build_options(collect_option_comments('src/js/collection_view.js')))
    
  src.gsub!('<!-- ERROR_OPTIONS -->', 
    build_options(collect_option_comments('src/js/has_error.js')))  

  # insert widgets and their associated option comments
  src.gsub!('<!-- MODEL_BOUND -->', build_components('doc/src/widgets/model'))
  src.gsub!('<!-- MODEL_BOUND_WITH_COLLECTION -->', build_components('doc/src/widgets/model_with_collection'))
  src.gsub!('<!-- COLLECTION_BOUND -->', build_components('doc/src/widgets/collection'))
  src.gsub!('<!-- NON_BOUND -->', build_components('doc/src/widgets/non_bound'))

  src.gsub!('<!-- SOURCE_SIZE -->', "#{File.size('dist/backbone-ui.tar')/1000}kb");
  src.gsub!('<!-- COMPRESSED_SIZE -->', "#{File.size('dist/backbone-ui-min.tar.gz')/1000}kb");

  index = File.open('doc/dist/index.html', 'w') {|file| file.puts(src)}

  # copy src and lib directories over to documentation root
  `cp -r dist doc/dist/dist`
  `cp -r lib doc/dist/`
  `cp -r src doc/dist/`
  `cp doc/src/style.css doc/dist/style.css`
  `cp doc/src/script.js doc/dist/script.js`
  `cp -r doc/lib doc/dist/`
  `cp -r doc/src/images doc/dist/`
  `cp -r doc/src/skins doc/dist/`
  `cp doc/src/test.html doc/dist/`
  `cd doc/dist/skins && tar -zcvf perka.tgz perka`
end

desc "pushing docs to gh-pages"
task :push_doc => [:doc] do
  puts "pushing docs to gh-pages"
  `cp -r doc/dist /tmp/docs && git checkout gh-pages && git pull origin gh-pages && rm -rf * && cp -r /tmp/docs/* . && git add . && git commit -m "updating docs" && git push origin gh-pages && git checkout master`
end
