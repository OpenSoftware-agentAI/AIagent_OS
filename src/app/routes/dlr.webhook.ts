import { Router } from 'express';

export const dlrRouter = Router();

/**
 * POST /callbacks/dlr - SOLAPI 배달 결과 수신
 */
dlrRouter.post('/callbacks/dlr', async (req, res) => {
  try {
    console.log('DLR 수신:', JSON.stringify(req.body, null, 2));
    
    // TODO: 데이터베이스에 배달 결과 저장
    // const reports = Array.isArray(req.body) ? req.body : [req.body];
    // for (const report of reports) {
    //   await saveDlrResult(report);
    // }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('DLR 처리 오류:', error);
    res.status(500).json({ success: false });
  }
});