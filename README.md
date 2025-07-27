# Ürün Slayt Bileşeni

E-ticaret siteleri için duyarlı ve özelleştirilebilir ürün slayt bileşeni, vanilla JavaScript ile oluşturulmuştur.

## Özellikler

- 🚀 Tamamen duyarlı tasarım
- 🔄 Akıcı geçiş animasyonları
- 🎨 Özelleştirilebilir görünüm
- ⚡ Dokunmatik ve fare sürükleme desteği
- 🔄 Sonsuz döngü özelliği
- 📱 Mobil uyumlu dokunmatik kontroller
- ⚙️ Kolay yapılandırma seçenekleri

## Kurulum

1. Depoyu klonlayın:
```bash
git clone https://github.com/yourusername/insider-codecraft-25-bootcamp-final-task.git
```

2. HTML dosyanıza CSS ve JavaScript dosyalarını ekleyin:
```html
<link rel="stylesheet" href="path/to/product-carousel.css">
<script src="path/to/product-carousel.js"></script>
```

## Kullanım

1. HTML'inizde bir konteyner elementi oluşturun:
```html
<div id="product-carousel" class="product-carousel">
    <!-- Ürünleriniz buraya gelecek -->
    <div class="product-item">
        <img src="urun1.jpg" alt="Ürün 1">
        <h3>Ürün 1</h3>
        <p>Ürün 1'in açıklaması</p>
    </div>
    <!-- Daha fazla ürün -->
</div>
```

2. Slayt bileşenini başlatın:
```javascript
document.addEventListener('DOMContentLoaded', function() {
    const carousel = new ProductCarousel({
        container: '#product-carousel',
        itemsToShow: 4,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000
    });
});
```

## Yapılandırma Seçenekleri

| Seçenek | Tür | Varsayılan | Açıklama |
|--------|------|---------|-------------|
| container | string | '.product-carousel' | Slayt konteyneri için CSS seçici |
| itemsToShow | number | 4 | Aynı anda gösterilecek ürün sayısı |
| infinite | boolean | false | Sonsuz döngüyü etkinleştir |
| autoplay | boolean | false | Otomatik oynatmayı etkinleştir |
| autoplaySpeed | number | 3000 | Otomatik oynatma hızı (milisaniye) |
| showDots | boolean | true | Gezinme noktalarını göster |
| showArrows | boolean | true | Gezinme oklarını göster |

## Tarayıcı Desteği

- Chrome (en son sürüm)
- Firefox (en son sürüm)
- Safari (en son sürüm)
- Edge (en son sürüm)
- Mobile Safari (iOS 10+)
- Android için Chrome


## Yazar

Sinem Sevimli Kurt (https://github.com/sinemsevimlikurt)