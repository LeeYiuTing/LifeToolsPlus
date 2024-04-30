package site.psvm.common.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import site.psvm.bootStart.StaticPathConfig;
import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;

/**
 * 图片工具
 */
@Component
public class ImageUtil {

    private final StaticPathConfig staticPathConfig;

    @Autowired
    public ImageUtil(StaticPathConfig staticPathConfig) {
        this.staticPathConfig = staticPathConfig;
    }

    //保存图片
    public void saveImage(String name, InputStream is) {
        //保存到d:/album
        File file = new File(staticPathConfig.getOriginalDiskPath() + name);
        try {
            FileOutputStream fos = new FileOutputStream(file);
            byte[] buffer = new byte[1024];
            int len = 0;
            while ((len = is.read(buffer)) != -1) {
                fos.write(buffer, 0, len);
            }
            fos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //压缩图片
    public void compressImage(String fileName) {
        try {
            String originalFilePath = staticPathConfig.getOriginalDiskPath() + fileName;
            String compressFilePath = staticPathConfig.getCompressedDiskPath() + fileName;
            //在存放静态图片的目录获取这个文件
            File sourceFile = new File(originalFilePath);
            if (!sourceFile.exists()) {
                System.out.println("文件不存在");
                return;
            }
            BufferedImage sourceImage = ImageIO.read(sourceFile);

            int sourceWidth = sourceImage.getWidth();
            int sourceHeight = sourceImage.getHeight();

            double aspectRatio = (double) sourceWidth / sourceHeight;

            int thumbnailWidth = 300;
            int thumbnailHeight = (int) (thumbnailWidth / aspectRatio);

            if (thumbnailHeight > 300) {
                thumbnailHeight = 300;
                thumbnailWidth = (int) (thumbnailHeight * aspectRatio);
            }

            BufferedImage thumbnailImage = new BufferedImage(thumbnailWidth, thumbnailHeight, BufferedImage.TYPE_INT_RGB);
            Graphics2D graphics = thumbnailImage.createGraphics();
            graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
            graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
            graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            graphics.drawImage(sourceImage, 0, 0, thumbnailWidth, thumbnailHeight, null);
            graphics.dispose();

            ImageIO.write(thumbnailImage, "jpg", new File(compressFilePath));
            //手动释放
            sourceImage.flush();
            thumbnailImage.flush();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
