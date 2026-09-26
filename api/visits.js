// دالة Vercel Serverless: تزيد عداد الزوار الإجمالي للموقع بمقدار 1 مع كل استدعاء
// وتُرجع القيمة الجديدة. تعتمد على قاعدة Redis (عبر تكامل Upstash من متجر Vercel)،
// وإن لم تكن متصلة تُرجع live:false ليعمل الواجهة الأمامية بعدّاد محلي احتياطي
// بدلاً من كسر الصفحة.
//
// لتفعيل العدّاد الحقيقي المشترك بين كل الزوار (دقيقتان فقط):
// لوحة تحكم Vercel للمشروع → Storage → Marketplace Database Providers → Upstash → Redis → Connect
// هذا يضيف تلقائيًا متغيّرَي البيئة UPSTASH_REDIS_REST_URL و UPSTASH_REDIS_REST_TOKEN
// (راجع README.md لمزيد من التفصيل)

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  try {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error('Redis غير متصل بعد')
    }
    const { Redis } = await import('@upstash/redis')
    const redis = Redis.fromEnv()
    const count = await redis.incr('tathkeer:visits:total')
    return res.status(200).json({ count, live: true })
  } catch (err) {
    // قاعدة البيانات غير متصلة بعد — نسمح للواجهة الأمامية بالتعامل مع الأمر بعدّاد محلي
    return res.status(200).json({ count: null, live: false })
  }
}
