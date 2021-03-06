set :application, 'cominst_stage_app'
set :repo_url, 'git@github.com:aaltomeri/cominst.com.git'

# Branch options
# Prompts for the branch name (defaults to current branch)
#ask :branch, -> { `git rev-parse --abbrev-ref HEAD`.chomp }

# Hardcodes branch to always be master
# This could be overridden in a stage config file
set :branch, :master

# Use :debug for more verbose output when troubleshooting
set :log_level, :info

# Apache users with .htaccess files:
# it needs to be added to linked_files so it persists across deploys:
# set :linked_files, fetch(:linked_files, []).push('.env', 'web/.htaccess')
set :linked_files, fetch(:linked_files, []).push('.env', 'web/.htaccess')
set :linked_dirs, fetch(:linked_dirs, []).push('web/app/uploads')

set :local_path, ''

#########
# Theme tasks
#########

set :theme_path, Pathname.new('web/app/themes/cominst')
set :local_app_path, Pathname.new(File.expand_path("../..", __FILE__))
set :local_theme_path, "#{fetch :local_app_path}/#{fetch :theme_path}"


# Install Composer dependencies for Sage 9 theme
namespace :deploy do
  desc 'Install Composer dependencies for Sage 9 theme'
  task :theme_composer_install do
    on roles(:app) do
      theme_path = release_path.join(fetch(:theme_path));
      within theme_path do
        execute "composer", "install"
      end
    end
  end
end
before 'deploy:updated', 'deploy:theme_composer_install'

# build Single Page App locally & upload to server
namespace :assets do

  # Compile assets for production
  task :compile do
    run_locally do
      # local_theme_path_escaped = Shellwords.shellescape(fetch(:local_theme_path))
      within fetch(:local_theme_path) do
        execute "npm", "run", "build:production"
      end
    end
  end

  # Upload compiled assets - we'll prefer the rsync task if possible as it is quicker
  task :upload_assets do
    on roles(:app) do
      upload! "#{fetch :local_theme_path}/dist", release_path.join(fetch(:theme_path)), recursive: true
    end
  end

  # Rsync compiled assets
  task :sync do
    on roles(:app) do |role|
      run_locally do
        local_theme_path_escaped = Shellwords.shellescape(fetch(:local_theme_path))
        execute "rsync -avz --delete #{local_theme_path_escaped}/dist #{role.username}@#{role.hostname}:#{release_path}/#{fetch :theme_path}"
      end
    end
  end

  # compile & upload compiled assets
  task deploy: %w(compile sync)
end
 
before 'deploy:updated', 'assets:deploy'

##########
# Misc
##########

namespace :deploy do
  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      # Your restart mechanism here, for example:
      # execute :service, :nginx, :reload
    end
  end
end

# The above restart task is not run by default
# Uncomment the following line to run it on deploys if needed
# after 'deploy:publishing', 'deploy:restart'

namespace :deploy do
  desc 'Update WordPress template root paths to point to the new release'
  task :update_option_paths do
    on roles(:app) do
      within fetch(:release_path) do
        if test :wp, :core, 'is-installed'
          [:stylesheet_root, :template_root].each do |option|
            # Only change the value if it's an absolute path
            # i.e. The relative path "/themes" must remain unchanged
            # Also, the option might not be set, in which case we leave it like that
            value = capture :wp, :option, :get, option, raise_on_non_zero_exit: false
            if value != '' && value != '/themes'
              execute :wp, :option, :set, option, fetch(:release_path).join('web/wp/wp-content/themes')
            end
          end
        end
      end
    end
  end
end

# The above update_option_paths task is not run by default
# Note that you need to have WP-CLI installed on your server
# Uncomment the following line to run it on deploys if needed
# after 'deploy:publishing', 'deploy:update_option_paths'

