function fnArgs (fn) {
    return fn.toString()
             .split('(')[1]
             .split(')')[0]
             .split(',')
             .map(arg => arg.split('=')[0])
}
