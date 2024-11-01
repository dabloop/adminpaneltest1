import EventEmitter from 'eventemitter3';

const logEmitter = new EventEmitter();

export default logEmitter;


// logEmitter.emit('addLog', {title: 'Error', message: `Error`, type: 'error'});
// logEmitter.emit('addLog', {title: 'Success', message: `Success`, type: 'success'});
// logEmitter.emit('addLog', {title: 'Info', message: `Info`, type: 'info'});
// logEmitter.emit('addLog', {title: 'Other', message: `Other`, type: 'other'});
