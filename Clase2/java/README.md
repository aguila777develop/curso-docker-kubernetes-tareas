# Administración de Servidores Linux (Básico a Avanzado Inicial)

> 🎯 Objetivo general

Capacitar a personas con nociones básicas de computación para que aprendan a manejar un servidor Linux: acceder por SSH, gestionar usuarios y permisos, instalar servicios web, configurar dominios y asegurar sus servidores. Ideal para quienes buscan ampliar su perfil laboral en soporte TI, web o freelancing.


## <mark>🔥 Desglose de temario a desarrollar</mark>

# <mark>📘 Módulo Básico</mark>

## 🗂 Tema 03: Administración de Archivos y Logs del Sistema

> ¿Qué hace? Navegan con cd, listan con ls, editan con nano, mueven archivos.

> 🎯 En el trabajo: Administrar configuraciones y logs sin entorno gráfico.

### 🚀 Comandos:

> Enviar elemento a papelera
* `apt install trash-cli` **Debian-Ubuntu**
* `dnf install trash ` **Fedora**
* `trash [archivo]`
* `~/.local/share/Trash/files `**Archivos**
* `~/.local/share/Trash/info `**Info**
* `trash-restore `**DIRECTORIO ELIMINACIÓN, Seleccion index a restaurar**

> Identificar comandos en base a coincidencias en textos de ayuda simple
* `sudo mandb` **Actualizamos DB de comando man para busqueda de coincidencias de predicciones**  
* `apropos director` **Buscamos en ayuda descriptiva coincidencias de palabras para comandos**  
* `apropos trash` 

> Identifica partición asignada en ruta
* `df -h`  

> **EXPLICACION PARTICIONES MOSTRADAS**

| Sistema de Archivos | Punto de Montaje     | ¿Qué es?                                                                 |
|---------------------|----------------------|-------------------------------------------------------------------------|
| tmpfs               | /run                 | Datos temporales del sistema y procesos activos.                        |
| tmpfs               | /dev/shm             | Memoria compartida entre procesos (RAM).                                |
| tmpfs               | /run/lock            | Archivos de bloqueo del sistema.                                        |
| /dev/sda15          | /boot/efi            | Partición EFI para el arranque del sistema (UEFI).                      |
| tmpfs               | /run/user/1000       | Datos temporales del usuario activo (en RAM, desaparecen al reiniciar). |

> Identificar espacio en particiones y crear particionados
* `cfdisk /dev/vda` **Herramienta de particionado**

> Espacio por archivos, directorios *más especifico
* `du -h /etc | tail` **Saber peso real de estrucura de directorios**

> Visualizar particionado con 
* `lsblk` **Muestra particiones, formatos y tamaños de particiones**

<mark>Identificar particiones sin puntos de montaje definidos</mark>

* `lsblk -a` **Muestra todas particiones y no montados**
  * **`disk` = disco físico, `part` = partición, `lvm` = volumen LVM**

| Sistema de Archivos | Compatible con Linux | Redimensionar ↓ (Reducir) | Redimensionar ↑ (Ampliar) | Soporte de Journaling | Ventajas Principales                       | Limitaciones                        | Uso más común |
|---------------------|:--------------------:|:-------------------------:|:-------------------------:|:---------------------:|-------------------------------------------|-----------------------------------|--------------|
| ext4                | ✅ Sí                | ✅ Sí                     | ✅ Sí                     | ✅ Sí                 | Estable, compatible, reduce y amplía      | Límite 16 TiB por archivo          | Servidores, PCs de escritorio y laptops Linux |
| xfs                 | ✅ Sí                | ❌ No                     | ✅ Sí                     | ✅ Sí                 | Rápido con archivos grandes, muy estable  | No se puede reducir                | Almacenamiento de grandes volúmenes de datos y bases de datos |
| btrfs               | ✅ Sí                | ✅ Sí                     | ✅ Sí                     | ✅ Sí                 | Snapshots, compresión, verificación de datos | Complejidad, no tan maduro          | Servidores y entornos que necesitan recuperación rápida |
| zfs                 | ✅ (con módulos)     | ❌ No                     | ✅ Sí                     | ✅ Sí (propio)        | RAID, snapshots, autocorrección de errores | Alto consumo de RAM (mínimo 2–4 GB)| NAS, servidores de almacenamiento y copias de seguridad |
| vfat (FAT32)        | ✅ Parcial           | ✅ Sí                     | ✅ Sí                     | ❌ No                 | Compatible con Windows y dispositivos USB | Límite de 4 GB por archivo         | Memorias USB, tarjetas SD y dispositivos portátiles |
| ntfs                | ✅ (con drivers)     | ❌ No (solo con herramientas externas) | ✅ Parcial       | ✅ Parcial            | Compatible con Windows                     | No nativo en Linux, lento          | Discos duros y memorias que se usan con Windows |
| swap                | ❌ No                | ❌ No                     | ✅ Sí (recreando)         | ❌ No                 | Espacio de memoria virtual                 | No almacena archivos               | Ampliar memoria RAM virtual o hibernación |

---
> <h3> 🛠 ¿Cómo funciona el journaling?</h3>

* Escribes primero en el journal (una zona especial del disco reservada para esto).
* Ej.: “Voy a crear el archivo X y escribirle estos datos”.
  * El sistema aplica el cambio real en la ubicación final.
  * Marca en el journal que la operación se completó.
* Si el sistema se apaga inesperadamente (apagón, crash), al reiniciar:
  * Se revisa el journal.
  * Si hay operaciones que quedaron a medias, se repiten o revierten para mantener consistencia.

---
<h2>Identificar logs importantes y primeros filtrados de datos para monitorización y control </h2>

* **📌 ¿Qué es Rsyslog?**
  * Es un demonio de registro de eventos para Linux y Unix que recibe, filtra, almacena y reenvía logs.
  * Es más rápido y flexible que el syslog tradicional, y soporta formatos y protocolos modernos.

* **🛠️ Acciones típicas a realizar**
  * Configurar archivos de log locales.
  * Enviar logs a servidores remotos (centralización).
    * Auditar actividades de varios servidores en un solo lugar.
    * Prevenir pérdida de logs si un servidor es comprometido.
    * Simplificar búsquedas y correlación de eventos.
  * Filtrar mensajes por nivel de severidad o programa.
  * Rotar y comprimir logs antiguos.
  * Integrar con herramientas SIEM para análisis.

> Actualizar listado de repositorios
* `apt update`

> Instalación de utileria RSYSLOG
* `apt install rsyslog`
* `systemctl start rsyslog`
* `systemctl start rsyslogd.service` **FEDORA**
* `rsyslogd -v`
* `cat /etc/rsyslog.conf` <mark>Analizar archivo de configuración y archivos "monitoreados"</mark>
  * `$WorkDirectory /var/spool/rsyslog` **Cola temporal de mensajes cuando hay comunicación con servidores remotos de log**
>
* `*.*;auth,authpriv.none   -/var/log/syslog` **Mensajes del sistema**
* `auth,authpriv.*    /var/log/auth.log` **Mensajes de autenticación**
* `cron.*   /var/log/cron.log` **Mensajes cron**
* `daemon.* -/var/log/daemon.log` **Demonios/servicios**
* `user.*   -/var/log/user.log` **Mensajes, errores, warnings generados por usuario de trabajo**

> Navegar y listar logs importantes de sistema:
* `/var/log/auth.log` **Logs de autenticación: inicios de sesión, sudo, ssh**
* `/var/log/lastlog` <mark>Crear si no esta creado para llevar registro de ultima ip que inicio sesión y usuario</mark>
* `/var/log/lastlog` **Últimos inicios de sesión por usuario**
* `/var/log/apache2/ o /var/log/httpd/` **Logs de servidor web Apache (UBUNTU/DEBIAN Y FEDORA(httpd))**

---
> <h3> 🛠 Manipulación de cadenas para filtrado de datos</h3>

| Comando       | Descripción                                       | Ejemplo de uso                                               | Salida esperada |
|--------------|--------------------------------------------------|-------------------------------------------------------------|----------------|
| `cat`        | Muestra el contenido completo de un archivo       | `cat /var/log/syslog`                                       | Imprime todo el contenido en pantalla |
| `head`       | Muestra las primeras líneas de un archivo         | `head -n 5 archivo.txt`                                     | Las primeras 5 líneas del archivo |
| `tail`       | Muestra las últimas líneas de un archivo          | `tail -n 10 archivo.txt`                                    | Las últimas 10 líneas del archivo |
| `tail -f`    | Sigue el crecimiento del archivo en tiempo real   | `tail -f /var/log/syslog`                                   | Muestra logs en vivo |
| `cut`        | Extrae columnas o caracteres de cada línea        | `cut -d ":" -f 1 /etc/passwd`                               | Muestra solo el primer campo (usuarios) |
| `grep`       | Busca patrones en texto usando expresiones regulares | `grep "error" /var/log/syslog`                              | Muestra solo las líneas que contienen "error" |
| `awk`        | Procesa texto por columnas y permite operaciones  | `awk -F ":" '{print $1}' /etc/passwd`                       | Imprime solo la primera columna (usuario) |
| `sed`        | Editor de texto en línea (sustitución, borrado)   | `sed 's/error/ERROR/g' archivo.txt`                         | Reemplaza "error" por "ERROR" en todas las líneas |
| `sort`       | Ordena líneas alfabéticamente o numéricamente     | `sort archivo.txt`                                          | Imprime las líneas ordenadas |
| `uniq`       | Elimina líneas duplicadas (requiere `sort` previo)| `sort archivo.txt \| uniq`                                  | Lista única de líneas |
| `wc`         | Cuenta líneas, palabras o caracteres             | `wc -l archivo.txt`                                         | Número de líneas |
| `tr`         | Traduce o elimina caracteres                      | `echo "hola mundo" \| tr 'a-z' 'A-Z'`                       | Convierte a mayúsculas |
| `xargs`      | Pasa salida de un comando como argumento de otro  | `cat lista.txt \| xargs rm`                                 | Elimina todos los archivos listados |
| `tee`        | Muestra salida en pantalla y la guarda en archivo | `ls -l \| tee listado.txt`                                  | Imprime y guarda el resultado |
| `find`       | Busca archivos según condiciones                  | `find /var/log -name "*.log"`                               | Lista todos los archivos `.log` en /var/log |
| `less`       | Permite paginar y navegar en el texto             | `less /var/log/syslog`                                      | Navegación interactiva (↑ ↓ / búsqueda) |

> Ejemplos empleando filtros de cadena
* `cat /etc/passwd | awk -F "::" '{print $2}' | grep -v '^$'` **Mostrando rutas home empleadas y terminales asignadas a usuarios**


> <h3>Filtrado de datos</h3>
* `grep -v "Accepted" /var/log/auth.log`
* `grep -i "error" /var/log/syslog` **Evitar case sensitive**
* `grep -E '2025-07-20.*Failed password' /var/log/auth.log` **Filtrar intentos de acceso por día**
* `fail2ban-client status sshd` **Verificar intentos de sesión**
* `grep -Ei "Failed|Error" /var/log/syslog` **Operador OR, coincidencias sin case sentitive**
* `awk '{print $1, $3}' archivo.log` **Separación por defecto en awk son los espacios**
* `awk -F ',' '{print $1, $3}' archivo.log` **Separación modificada ','**

**<mark>Ejemplo con variables, bash y awk</mark>**
```bash
tail -n 50 auth.log | grep "Failed" | awk '{
  fecha = substr($1, 1, 10);
  ip = $9;
  port = $11;
  print "Alerta: Fecha:", fecha, ", IP:", ip, ", Puerto:", port;
}'
```

<h3>ACTIVIDAD PARA EL ALUMNO</h3>

> Realizar un recorrido en archivos /var/log/* del sistema e identificar los mas importantes, generar mensajes de ayuda con la utileria grep, awk, etc para crear un sistema de alarmas en posteriores clases, ejemplo:
  * `grep -E '2025-07-20.*Failed password' /var/log/auth.log` 
  * **Comando anterior filtrará lineas con inicio de sesión**
  
> **En proximas clases será util identificar si este comando genera una salida significa que en esta fecha hay intentos de sesión y se emitirá una alarma a un servicio web de notificaciones push que configuraremos**