# Carrick Compare 部署说明

## 开发模式
```bash
npm run dev
# http://localhost:5173
```

## 生产构建
```bash
npm run build
```

## 本地预览
```bash
npm run preview
# http://localhost:4173
```

## 静态服务器部署
```bash
# 使用任意静态服务器
npx serve dist
# 或
python3 -m http.server 8080 --directory dist
```
