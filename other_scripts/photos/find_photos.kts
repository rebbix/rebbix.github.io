#!/usr/bin/env kscript

@file:Include("utils.kt")

@file:DependsOn("com.github.kittinunf.fuel:fuel:1.15.1")
@file:DependsOn("com.github.kittinunf.result:result:1.5.0")

import com.github.kittinunf.fuel.Fuel
import java.io.File

/**
 * Script to reload Rebbix website photos.
 * Look at specified source folder. Try to get photos automatically (currently Facebook and Instagram supported).
 * Support option to manually specify URL to an image. Saves results in destination folder.
 */

var source = File("/rebbix/rebbix.github.io.git/_life")
var destination = File("/rebbix/raw_photos")

// Key specific for photo markdown file
val EMBED_KEY = "embed"

// Regexp to get values from markdown files for photos
val contentRegexp = Regex("^(\\w+):\\s\"?([^\"\\n\\r]+)\"?\$")
// Regexp to match photo size properties in markdown file for the following removal
val sizePropertyRegexp = Regex("(imageWidth|imageHeight):\\s\\d+(\\r\\n|\\r|\\n)")

// Regexp to grab photo from Facebook page source code
val fbPhotoRegexp = Regex("(<meta property=\"og:image\" content=\")(.+?)(\"\\s?/?>)")
// CSS style of photo container in Facebook page source code
val fbPhotoContainerStyle = "uiScaledImageContainer _4-ep"

var processedAuto = 0
var processedManual = 0
var manualProcessingEnabled = false
var onlyErrors = false

// START
println("$ANSI_GREEN Hello from Kotlin Script! $ANSI_RESET")

println("Specify source path or skip to continue with default.")
print("Enter: ")
readLine()?.let {
    if (it.isNotBlank()) {
        source = File(it)
    }
}

println("Specify destination path or skip to continue with default.")
print("Enter: ")
readLine()?.let {
    if (it.isNotBlank()) {
        destination = File(it)
    }
}

print("Enable errors manual processing? [y/n]: ")
manualProcessingEnabled = readLine().equals("y", true)

print("Process only error cases? [y/n]: ")
onlyErrors = readLine().equals("y", true)

// MAIN JOB
checkSource(source)
checkDestination(destination)

val files = source.listFiles()

println("Found ${files.size} files.")
println("Processing...")

files.forEach { file ->
    val content = getFileContent(file)

    if (content.containsKey(EMBED_KEY)) {
        when (content[EMBED_KEY]) {
            "facebook" -> processFacebook(file, content)
            "instagram" -> processInstagram(file, content)
        }
    }
}

// FINISH
println("Processed $processedAuto (auto) & $processedManual (manual) files.")
println("Job completed.")


// HELP FUNCTIONS
/**
 * Get content of photo markdown file.
 * @param file to process.
 * @return map with found key-value pairs from file.
 */
fun getFileContent(file: File): Map<String, String> {
    val content = HashMap<String, String>()
    file.readLines().forEach { str ->
        contentRegexp.find(str)?.let { result ->
            val (k, v) = result.destructured // by regexp we look for two match groups (key & value)
            content.put(k, v)
        }
    }
    return content
}

/**
 * Remove size definitions from photo markdown file.
 */
fun deleteSizeAttributes(file: File) {
    val edited = file.readText()
            .replace(sizePropertyRegexp, "") // remove width
            .replace(sizePropertyRegexp, "") // remove height
    file.writeText(edited)
}

/**
 * Download image locally and remove size definitions from markdown file.
 */
fun downloadFile(imageUrl: String, file: File, filename: String) {
    try {
        val (_, response, _) = Fuel.download(imageUrl).destination { _, _ ->
            deleteSizeAttributes(file)
            File(destination, filename).also { it.createNewFile() }
        }.response()

        println("File: $filename. Result: $ANSI_GREEN ${response.statusCode} ${response.responseMessage} $ANSI_RESET")
    }
    catch (ex: Exception) {
        println("File: $filename. $ANSI_RED File download has failed! $ANSI_RESET")
    }
}

/**
 * Process with photo manually. Show URL from markdown file and wait for image direct URL.
 */
fun processManually(file: File, sourceUrl: String, filename: String) {
    println("File '$filename', $sourceUrl")
    print("$ANSI_YELLOW Insert image URL: $ANSI_RESET")
    readLine()?.let { input ->
        if (input.contains("http")) {
            downloadFile(input, file, filename)
        }
    }
}

fun processFacebook(file: File, content: Map<String, String>) {
    val filename = content["img"]?.substringAfterLast('/') ?: "${content["img"]}.jpg"

    //println(content["link"])

    val (_, _, result) = Fuel.get("${content["link"]}").responseString()
    val pageSource = result.component1() ?: "invalid"
    val matchResult = fbPhotoRegexp.find(pageSource)
    val photoFound = pageSource.contains(fbPhotoContainerStyle) && matchResult != null

    if (photoFound && !onlyErrors) {
        val (_, url, _) = matchResult!!.destructured
        val fixedUrl = url.replace("&amp;", "&")
        downloadFile(fixedUrl, file, filename)
        processedAuto++
    }
    else if (!photoFound && manualProcessingEnabled) {
        processManually(file, content["link"] ?: "empty link", filename)
        processedManual++
    }
}

fun processInstagram(file: File, content: Map<String, String>) {
    val filename = content["img"]?.substringAfterLast('/') ?: "${content["img"]}.jpg"

    //println(content["link"])

    val (_, _, result) = Fuel.get("${content["link"]}").responseString()
    val pageSource = result.component1() ?: "invalid"
    val matchResult = fbPhotoRegexp.find(pageSource)

    if (matchResult != null && !onlyErrors) {
        val (_, url, _) = matchResult.destructured
        val fixedUrl = url.replace("&amp;", "&")
        downloadFile(fixedUrl, file, filename)
        processedAuto++
    }
    else if (matchResult == null && manualProcessingEnabled) {
        processManually(file, content["link"] ?: "empty link", filename)
        processedManual++
    }
}