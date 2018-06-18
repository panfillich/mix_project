# -*- mode: ruby -*-
# vi: set ft=ruby :
# sudo ssh -v ubuntu@192.168.50.8 -p 22 -i /vagrant/.vagrant/machines/subject/virtualbox/private_key -o StrictHostKeyChecking=no


# order provision command in vagrant - https://github.com/hashicorp/vagrant/issues/6035
# vagrant plugin install vagrant-disksize

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # define main server
  config.vm.define "subject" do |subject|
    subject.vm.box = "ubuntu/bionic64"

    subject.disksize.size = '50GB'
    subject.vm.network "public_network"
    subject.vm.network "private_network", ip: "192.168.50.10"
    subject.vm.provider "virtualbox" do |v|
      v.name = "CG main vm"
      v.cpus = 1
      v.memory = 1024
    end
    subject.vm.network "forwarded_port", guest: 80, host: 8080
    # Dev environment https/http
    subject.vm.network "forwarded_port", guest: 3000, host: 3000
    subject.vm.network "forwarded_port", guest: 3001, host: 3001
    # Webpack dev server
    subject.vm.network "forwarded_port", guest: 3900, host: 3900

    # Prod environment https/http
    subject.vm.network "forwarded_port", guest: 4000, host: 4000
    subject.vm.network "forwarded_port", guest: 4001, host: 4001
    # Test environment https/http
    subject.vm.network "forwarded_port", guest: 5000, host: 5000
    subject.vm.network "forwarded_port", guest: 5001, host: 5001
    # Mysql and redis
    subject.vm.network "forwarded_port", guest: 3306, host: 3306
    subject.vm.network "forwarded_port", guest: 6379, host: 6379

    # For jupyter
    subject.vm.network "forwarded_port", guest: 6000, host: 6000

    # chat bot
    subject.vm.network "forwarded_port", guest: 4041, host: 4041

    #subject.vm.provision "run", type: "shell", inline: <<-SHELL
    #    cd /vagrant
    #    npm test
    #SHELL

    # fix for Ubuntu >= 17
    subject.vm.provision "fix-for-Ubuntu>=17", type: "shell", inline: <<-SHELL
        sudo apt-get install ifupdown
    SHELL

    subject.vm.provider :virtualbox do |vb|
      vb.gui = true
    end

  end

  # define ansible control box
  config.vm.define "control" do |control|
    control.vm.box = "ubuntu/bionic64"
    control.vm.network "public_network"
    control.vm.network "private_network", ip: "192.168.50.4"
    control.vm.provider "virtualbox" do |v|
      v.name = "CG Ansible control vm"
      v.cpus = 1
      v.memory = 512
    end

    # fix for "stdin: is not a tty" error
    control.vm.provision "fix-no-tty", type: "shell", privileged: false, inline: <<-SHELL
        sudo sed -i '/tty/!s/mesg n/tty -s \\&\\& mesg n/' /root/.profile
    SHELL

    # fix for "dpkg-preconfigure: unable to re-open stdin: No such file or directory"
    control.vm.provision "fix-dpkg", type: "shell", inline: <<-SHELL
       locale-gen en_US.UTF-8
       export LANGUAGE=en_US.UTF-8
       export LANG=en_US.UTF-8
       export LANG=en_US.UTF-8
       echo 'LANGUAGE="en_US.UTF-8"' >> /etc/default/locale
       echo 'LANG=\"en_US.UTF-8\"' >> /etc/default/locale
       echo 'LC_ALL=\"en_US.UTF-8\"' >> /etc/default/locale
    SHELL

    # fix for Ubuntu >= 17
    control.vm.provision "fix-for-Ubuntu>=17", type: "shell", inline: <<-SHELL
        sudo apt-get install ifupdown -y
    SHELL

    control.vm.provision "install-ansible", type: "shell", inline: <<-SHELL
       apt-get update
       apt-get install software-properties-common -y
       apt-add-repository ppa:ansible/ansible -y
       apt-get update
       apt-get install ansible -y
    SHELL

    # http://docs.ansible.com/ansible/latest/guide_vagrant.html
    # run playbook
    control.vm.provision "ansible", type: "shell", inline: "ansible-playbook /vagrant/web.yml -i /vagrant/hosts"
  end
end