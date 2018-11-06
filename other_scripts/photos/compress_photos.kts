#!/usr/bin/env kscript

@file:Include("utils.kt")

@file:DependsOn("org.imgscalr:imgscalr-lib:4.2")

import org.imgscalr.Scalr
import java.io.File
import javax.imageio.IIOImage
import javax.imageio.ImageIO
import javax.imageio.ImageWriteParam
import javax.imageio.stream.FileImageOutputStream

/**
 * Script to compress photos for Rebbix website.
 * Get photos from source folder, process them and save into destination folder.
 */

val source = File("/rebbix/raw_photos")
val destination = File("/rebbix/compressed_photos")

var processed = 0

val writer = ImageIO.getImageWritersByFormatName("jpg").next()

val qualityParams = writer.defaultWriteParam.apply {
    progressiveMode = ImageWriteParam.MODE_DEFAULT
    compressionMode = ImageWriteParam.MODE_EXPLICIT
    compressionQuality = 0.9f
}

// START
println("$ANSI_GREEN Hello from Kotlin Script! $ANSI_RESET")

checkSource(source)
checkDestination(destination)

val files = source.listFiles()

// MAIN JOB
print(" Processing... $processed / ${files.size}")

files.forEach { file ->
    ImageIO.read(file)?.let { image ->
        val scaled = Scalr.resize(image, Scalr.Method.QUALITY, 1024, Scalr.OP_ANTIALIAS)

        writer.output = FileImageOutputStream(File(destination, file.name))
        writer.write(null, IIOImage(scaled, null, null), qualityParams)

        processed++
        print("\r Processing... $processed / ${files.size}")
    }
}

writer.dispose()

// FINISH
println()
println("Job completed.")