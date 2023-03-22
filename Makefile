install:
	if [ -d .wonderwall ]; then rm -rf .wonderwall; fi
	mkdir -p .wonderwall
	curl -o .wonderwall/master.zip -LO https://github.com/nais/wonderwall/archive/refs/heads/master.zip
	unzip -d .wonderwall/ .wonderwall/master.zip
	cd .wonderwall/wonderwall-master && $(MAKE) wonderwall

