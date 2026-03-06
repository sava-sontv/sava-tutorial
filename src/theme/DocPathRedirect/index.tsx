/**
 * Redirect từ route /categories/..., /sections/..., /articles/... sang docPath tương ứng,
 * kèm state.fromPath để DocRoot có thể replace URL giữ nguyên.
 */
import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';

export default function DocPathRedirect({
  path: fromPath,
  docPath,
}: {
  path: string;
  docPath: string;
}): React.ReactElement {
  const history = useHistory();
  const { withBaseUrl } = useBaseUrlUtils();
  useEffect(() => {
    history.replace(withBaseUrl(docPath), { fromPath });
  }, [history, docPath, fromPath, withBaseUrl]);
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      Đang chuyển hướng…
    </div>
  );
}
