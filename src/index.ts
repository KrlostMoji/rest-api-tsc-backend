import server from './server';
import colors from 'colors';

const port = 3787;

server.listen(port, () => {
  console.log(colors.cyan.bold(`REST API en el puerto ${port}`));
});
