export default async function handler(req, res) {
  try {
    // Call VPS heartbeat trigger
    const response = await fetch('https://laicai.tech/api/secure/heartbeat-trigger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CRON_SECRET}`
      }
    });
    
    if (response.ok) {
      res.status(200).json({ success: true, message: 'Heartbeat triggered successfully' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to trigger heartbeat' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}