import App from '@/app';
import AuthRoute from '@routes/auth.route';
import validateEnv from '@utils/validateEnv';
import AdminRoute from './routes/admin.route';
import ProductRoute from './routes/product.route';
import OrderRoute from './routes/order.route';

validateEnv();

const app = new App([
    new AuthRoute(),
    new AdminRoute(),
    new ProductRoute(),
    new OrderRoute()
]);

app.listen();
