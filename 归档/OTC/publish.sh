#pm2 list  有dev-rightbtc-OTC-3000服务运行的情况下运行
git pull
npm run builddev
pm2 reload "dev-rightbtc-OTC-3000"

#pm2 list  无dev-rightbtc-OTC-3000服务运行的情况下运行
# pm2 start npm --name "dev-rightbtc-OTC-3000" -- run publishdev
date