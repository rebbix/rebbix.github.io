import java.io.File

// Terminal coloring constants
val ANSI_RESET = "\u001B[0m"
val ANSI_RED = "\u001B[31m"
val ANSI_GREEN = "\u001B[32m"
val ANSI_YELLOW = "\u001B[33m"

fun checkSource(dir: File) {
    if (!dir.exists() || !dir.isDirectory || !dir.canRead() || dir.listFiles() == null) {
        println("$ANSI_RED ERROR: Source directory is invalid. $ANSI_RESET")
        System.exit(1)
    }
}

fun checkDestination(dir: File) {
    if (!dir.exists()) {
        dir.mkdir()
    }
    if (!dir.exists() || !dir.isDirectory || !dir.canWrite()) {
        println("$ANSI_RED ERROR: Destination directory is invalid. $ANSI_RESET")
        System.exit(1)
    }
}
