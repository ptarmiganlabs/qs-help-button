const menuItems = [{ action: 'feedback' }];
const feedbackItem = menuItems.find((item) => item.action === 'feedback');
const feedbackConfig = feedbackItem ? feedbackItem.feedback || {} : null;
console.log('feedbackConfig:', feedbackConfig);
const cb = feedbackConfig ? () => console.log('OPEN:', feedbackConfig) : undefined;
console.log('typeof cb:', typeof cb);
if (cb) cb();
