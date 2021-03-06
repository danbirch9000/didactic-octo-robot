Import-Module WebAdministration
Add-Type -Path C:\Windows\System32\inetsrv\Microsoft.Web.Administration.dll

#Ensure the following has been run on the remote server
#	Set-ExecutionPolicy Unrestricted
	
# Useful stuff
# http://www.iis.net/learn/manage/powershell/powershell-snap-in-creating-web-sites-web-applications-virtual-directories-and-application-pools

Function IIS-Stop {
	param ($websiteName)

    Stop-Website $websiteName
}

Function IIS-Start {
	param ($websiteName)
	
    Start-Website $websiteName
}

Function IIS-ISAPI-Update {
	param ($path, $value)
	
	Set-WebConfiguration "/system.webServer/security/isapiCgiRestriction/add[@path='$path']/@allowed" -value "$value" -PSPath:IIS:\
}

Function IIS-MimeType-Add {
	param ($extension, $type)
	
	&"$Env:SystemRoot\system32\inetsrv\appcmd.exe" set config /section:staticContent /+"[fileExtension='$extension',mimeType='$type']"
}

Function IIS-AppPool-Update {
	param ($appPoolName, $frameworkVersion = "v4.0", $managedPipelineMode = "Integrated", $identity, $password)

	$appPoolPath = ("IIS:\AppPools\" + $appPoolName)
	$appPool = Get-Item $appPoolPath -ErrorAction SilentlyContinue

	if (!$appPool) {
	    New-Item $appPoolPath
	    $appPool = Get-Item $appPoolPath
	}

	Set-ItemProperty $appPoolPath ManagedRuntimeVersion $frameworkVersion

	if ($identity -eq "LocalSystem") {
		Set-ItemProperty -Path $appPoolPath -Name processmodel.identityType -Value 0
	} elseif ($identity -eq "LocalService") {
		Set-ItemProperty -Path $appPoolPath -Name processmodel.identityType -Value 1
	} elseif ($identity -eq "NetworkService") {
		Set-ItemProperty -Path $appPoolPath -Name processmodel.identityType -Value 2
	} elseif ($identity -eq "ApplicationPoolIdentity") {
		Set-ItemProperty -Path $appPoolPath -Name processmodel.identityType -Value 4
	} else {
		Set-ItemProperty -Path $appPoolPath -Name processmodel.identityType -Value 3
		Set-ItemProperty -Path $appPoolPath -Name processmodel.username -Value $identity
		Set-ItemProperty -Path $appPoolPath -Name processmodel.password -Value $password
	}
	
	Set-ItemProperty $appPoolPath -Name "managedPipelineMode" -Value ([int][Microsoft.Web.Administration.ManagedPipelineMode]::$managedPipelineMode)
}

Function IIS-WebApplication-Create {
    param ($path, $name, $appPoolName)

    $webApplicationIIS = 'IIS:\Sites\Default Web Site\' + $name

    if (-not (Test-Path ($webApplicationIIS))) {
        New-Item ($webApplicationIIS) -PhysicalPath ($path) -Type Application
    } else {
        Set-ItemProperty ($webApplicationIIS) -Name PhysicalPath -Value ($path)
    }

    Set-ItemProperty ($webApplicationIIS) -Name applicationPool -Value ($appPoolName)
}

#http://www.iis.net/learn/manage/powershell/powershell-snap-in-advanced-configuration-tasks
#Example Usage:-
#IIS-Handler-Mappings
#	$name = "svc-ISAPI-2.0"
#	$path = "*.svc"
#	$modules = "IsapiModule"
#	$scriptProcessor="%windir%\Microsoft.NET\Framework\v2.0.50727\aspnet_isapi.dll"
#	$verb="*"
#	$requireAccess="Script"
Function IIS-Handler-Mappings {
	param ($name, $path, $modules, $scriptProcessor, $verb, $requireAccess)
	
	&"$Env:SystemRoot\system32\inetsrv\appcmd.exe" set config /section:handlers /+"[name='$name',path='$path',modules='$modules',scriptProcessor='$scriptProcessor',verb='$verb',requireAccess='$requireAccess']"
}

Function IIS-VirtualDirectory-Create {
    param ($webApplicationName, $path, $name)
    
    # Create the directory if it doesn't exist
    New-Item -ItemType Directory -Force -Path ($path) | Out-Null

    $webApplicationIIS = 'IIS:\Sites\Default Web Site\' + $webApplicationName

    if (-not (Test-Path ($webApplicationIIS))) {
        New-Item ($webApplicationIIS) -PhysicalPath ($path) -Type VirtualDirectory
    } else {
        Set-ItemProperty ($webApplicationIIS) -Name PhysicalPath -Value ($path)
    }
}

Function IIS-WebSite-Create {
    param ($path, $name, $binding, $appPoolName)

    # Create the directory if it doesn't exist
    New-Item -ItemType Directory -Force -Path ($path) | Out-Null

    $webApplicationIIS = 'IIS:\Sites\' + $name

    if (-not (Test-Path ($webApplicationIIS))) {
		New-Item ($webApplicationIIS) -Bindings @{protocol="http";bindingInformation=":80:$binding"} -PhysicalPath ($path)
    } else {
        Set-ItemProperty ($webApplicationIIS) -Name physicalPath -Value $path
    }

    Set-ItemProperty ($webApplicationIIS) -Name applicationPool -Value ($appPoolName)
}

Function IIS-WebApplications-Remove {
    param ($webApplicationNames)

	foreach($webApplicationName in $webApplicationNames.GetEnumerator()) {
		if (Get-WebApplication -Site "Default Web Site" -Name $webApplicationName.Key) {
            Remove-WebApplication -Site "Default Web Site" -Name $webApplicationName.Key
        }
    }
}

Function IIS-WebApplication-AppPool-Set {
    param ($applicationName, $appPoolName)
    

    $webApplicationIIS = 'IIS:\Sites\Default Web Site\' + $name
    Set-ItemProperty ($webApplicationIIS) -Name applicationPool -Value ($appPoolName)
}

Function IIS-LoadPage {
    param ($urls)
    
	$webclient = New-Object Net.WebClient
		
	foreach($url in $urls) {
		$webclient.DownloadString($url);
	}
}

Function IIS-HostsFile-Set {
    param ($hostName, $ipAddress)

	$filePath = "C:\Windows\System32\drivers\etc\hosts"

	IIS-HostsFile-Remove $hostname
	$ipAddress + "`t" + $hostName | Out-File -encoding ASCII -append $filePath
}

Function IIS-HostsFile-Remove {
    param ($hostName)

	$filePath = "C:\Windows\System32\drivers\etc\hosts"
	$content = Get-Content $filePath
	$newLines = @()
	
	foreach ($line in $content) {
		$bits = [regex]::Split($line, "\t+")

		if ($bits.count -eq 2) {
			if ($bits[1] -ne $hostName) {
				$newLines += $line
			}
		} else {
			$newLines += $line
		}
	}
	
	# Write file
	Clear-Content $filePath
	foreach ($line in $newLines) {
		$line | Out-File -encoding ASCII -append $filePath
	}
}
