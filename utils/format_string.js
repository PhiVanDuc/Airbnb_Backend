const format_string = (string) => {
    const format_space = string.replace(/\s+/g, " ");
    return format_space.toLowerCase().trim();
}

module.exports = format_string;