set :stage, :staging

# Simple Role Syntax
# ==================
#role :app, %w{deploy@example.com}
#role :web, %w{deploy@example.com}
#role :db,  %w{deploy@example.com}

set :branch, :dev

# Extended Server Syntax
# ======================
server 'aaltomeri.webfactional.com', user: 'aaltomeri', roles: %w{web app db}


set :webfaction_home, '/home/aaltomeri'
set :tmp_dir, "#{fetch(:webfaction_home)}/tmp"
set :deploy_to, "#{fetch(:webfaction_home)}/webapps/#{fetch(:application)}"

# Composer options
set :composer_install_flags, '--no-dev --no-interaction --quiet --optimize-autoloader'
# set :composer_install_flags, '--optimize-autoloader'

# this is necessary
SSHKit.config.command_map[:composer] = "php71 #{shared_path.join('composer.phar')}"



# you can set custom ssh options
# it's possible to pass any option but you need to keep in mind that net/ssh understand limited list of options
# you can see them in [net/ssh documentation](http://net-ssh.github.io/net-ssh/classes/Net/SSH.html#method-c-start)
# set it globally
#  set :ssh_options, {
#    keys: %w(~/.ssh/id_rsa),
#    forward_agent: false,
#    auth_methods: %w(password)
#  }

fetch(:default_env).merge!(wp_env: :staging)
