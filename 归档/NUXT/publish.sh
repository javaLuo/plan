#pm2 list  有dev-Rightbtc2.0-4000服务运行的情况下运行
git pull
npm run build
pm2 reload "dev-Rightbtc2.0-4000"

#pm2 list  无dev-Rightbtc2.0-4000服务运行的情况下运行
# pm2 start npm --name "dev-Rightbtc2.0-4000" -- run publishDev
date