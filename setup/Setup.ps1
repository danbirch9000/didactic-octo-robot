Write-Host "Installation commencing..."

# SET VARIABLES
	if ($projectDirectory -eq $null) {
		$projectDirectory = ((Split-Path $SCRIPT:MyInvocation.MyCommand.Path -Parent) + "\..")
	}

	$hostName = "portalCapHpiCom"
	$frameworkVersion = "v4.0"
	$appPoolName = $hostName
	$appPoolUser = "NetworkService"
	$managedPipelineMode = "Integrated"
	$websitePath = (Resolve-Path ($projectDirectory)).Path

# INCLUDE FUNCTIONS
	. ($projectDirectory + "\Setup\IIS.ps1")

# SETUP WEBSITES
	# Create the Website
	Write-Host "Creating the website..."

	IIS-AppPool-Update $appPoolName $frameworkVersion $managedPipelineMode $appPoolUser ""
	IIS-WebSite-Create $websitePath $hostName $hostName $appPoolName

	# Create Hosts File Entry
	Write-Host "Creating the Hosts file entry..."

	IIS-HostsFile-Set $hostName "127.0.0.1"

Write-Host "Installation completed"