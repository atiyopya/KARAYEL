$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("C:\Users\İsmail\Desktop\Kareyel Sunuculari.lnk")
$Shortcut.TargetPath = "C:\Users\İsmail\.gemini\antigravity\scratch\kareyel\start-servers.bat"
$Shortcut.WorkingDirectory = "C:\Users\İsmail\.gemini\antigravity\scratch\kareyel"
$Shortcut.IconLocation = "shell32.dll, 14"
$Shortcut.Save()
Write-Host "Kısayol başarıyla oluşturuldu!"
